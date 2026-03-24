/**
 * Open Bharat Digital Consent by IDfy
 * Copyright (c) 2025 Baldor Technologies Private Limited (IDfy)
 * 
 * This software is licensed under the Privy Public License.
 * See LICENSE.md for the full terms of use.
 * 
 * Unauthorized copying, modification, distribution, or commercial use
 * is strictly prohibited without prior written permission from IDfy.
 */

import { expiryFormatting } from '../utils/cookie_utils.services.js'
import { addScanCookieResults } from '../db/cookie/common.services.js'
import { ADDED_BY_USER, CSV_ROW_LIMIT } from '../constants.js'
import csv from 'csv-parser'
import { Readable } from 'stream'
import { addCookieSchema } from '../../validations/cookie.validations.js'
import { getDomainById } from '../db/domain.services.js'
import { handleServiceError } from '../utils.services.js'
import { logger } from '../logger/instrumentation.services.js'
import { UnexpectedError } from '../custom_error.js'

/**
 * Inserts multiple manually uploaded cookies into the database after formatting
 * fields into the required internal structure.
 *
 * This function:
 *  - Converts raw duration strings into the structured expiry format
 *    using `expiryFormatting`
 *  - Normalizes `sources` into a comma-separated string
 *  - Marks each cookie as `added_by_source = ADDED_BY_USER`
 *  - Calls `addScanCookieResults` to store cookies for the given scan & domain
 *
 * Used internally by the CSV upload flow but also works with manual payloads.
 *
 * @async
 * @function addCookiesToDB
 * @param {Array<Object>} cookies - List of validated cookie objects.
 * @param {string} scanId - Scan ID under which cookies should be stored.
 * @param {string} domainId - Domain ID associated with the cookies.
 * @returns {Promise<void>}
 * @throws {Error} If formatting fails or DB insertion fails.
 */
async function addCookiesToDB(cookies, scanId, domainId, userId) {
    const logDict = {
        service: 'CookiesAdd',
        reference_id: userId,
        reference_type: 'UserID',
        event_name: 'CookiesAdd',
        details: {
            user_id: userId,
            domain_id: domainId,
            cookies
        }
    }
    const result = {
        message: 'Success',
        status_code: 200
    }
    logger('info', 'Invoked', logDict)
    try {
        await getDomainById(domainId)
        const formattedCookies = formatCookies(cookies)
        await addScanCookieResults(formattedCookies, scanId, domainId)
        logger('info', 'Success', logDict, true)
        return result
    } catch (error) {
        logger('warn', 'Failed', logDict, true)
        return handleServiceError(result, error, {}, addCookiesToDB)
    }
}
/**
 * Processes a CSV file, validates each row, converts them into internal cookie
 * objects, and inserts them into the database for a specific scan & domain.
 *
 * Flow:
 *  1. Ensure domain access (authorization check).
 *  2. Parse CSV → validate headers → validate each row → map to internal format.
 *  3. Prepare cookies using `formatCookies()`.
 *  4. Insert them using `addScanCookieResults()`.
 *
 * Any parsing/validation/DB error stops processing immediately.
 *
 * @async
 * @function addCookiesViaCSV
 * @param {Buffer} fileBuffer - Raw CSV file content.
 * @param {string} scanId - Scan identifier.
 * @param {string} domainId - Domain identifier.
 * @param {string} userId - Current user ID for audit logging.
 * @returns {Promise<Object>} Result containing status, message, and parsed items.
 */
async function addCookiesViaCSV(fileBuffer, scanId, domainId, userId) {
    const logDict = {
        service: 'CookiesAddCSV',
        reference_id: userId,
        reference_type: 'UserID',
        event_name: 'CookiesAddCSV',
        details: { user_id: userId, domain_id: domainId }
    }

    const result = { message: 'Success', status_code: 200 }
    const expectedHeaders = [
        'cookie_name',
        'category',
        'description',
        'cookie_domain',
        'sources',
        'source_type',
        'is_session',
        'years',
        'months',
        'days'
    ]

    logger('info', 'Invoked', logDict)

    try {
        await getDomainById(domainId)
        const cookies = await parseCSV(fileBuffer, expectedHeaders)
        if (cookies.length > CSV_ROW_LIMIT) {
            throw UnexpectedError(`CSV file cannot have more than ${CSV_ROW_LIMIT} rows.`, 400)
        }
        if (cookies.length === 0) {
            throw UnexpectedError('CSV file cannot be empty.', 400)
        }
        const formattedCookies = formatCookies(cookies)
        await addScanCookieResults(formattedCookies, scanId, domainId)
        logger('info', 'Success', logDict, true)
        return result
    } catch (error) {
        logger('warn', 'Failed', logDict, true)
        return handleServiceError(result, error, {}, addCookiesViaCSV)
    }
}

/**
 * Formats an array of cookie objects into the structure required for database insertion.
 *
 * This function:
 * - Normalizes `sources` by converting arrays to comma-separated strings.
 * - Converts duration metadata using `expiryFormatting()`.
 * - Adds the `added_by_source` flag.
 *
 * @function formatCookies
 * @param {Array<Object>} cookies - Array of raw cookie objects.
 * @param {string} cookies[].cookie_name - Name of the cookie.
 * @param {string} cookies[].cookie_domain - Cookie domain (URL string).
 * @param {string} cookies[].category - Cookie category (e.g., NECESSARY, FUNCTIONAL).
 * @param {string} cookies[].description - Description of the cookie.
 * @param {Object} cookies[].duration - Duration metadata input object.
 * @param {Object} cookies[].duration.expiry - Expiry breakdown (years, months, days).
 * @param {boolean} cookies[].duration.is_session - Session flag for expiry.
 * @param {string|string[]} cookies[].sources - An array of string sources.
 *
 * @returns {Array<Object>} Formatted cookie array ready for DB processing. Each item has:
 * @returns {string} return[].cookie_name - Cookie name.
 * @returns {string} return[].cookie_domain - Cookie domain.
 * @returns {string} return[].category - Cookie category.
 * @returns {string} return[].description - Cookie description.
 * @returns {Object} return[].meta_data - Contains formatted duration and sources.
 * @returns {Object} return[].meta_data.duration - Output from `expiryFormatting()`.
 * @returns {Array<String>} return[].meta_data.sources - array of sources.
 * @returns {<String>} return[].meta_data.source_type - defines type of source.
 * @returns {string} return[].added_by_source - Tracks that cookie was added manually (via CSV or UI).
 */
function formatCookies(cookies) {
    const formatCookie = cookies.map((item) => {
        const meta_data_expiry = expiryFormatting(item.duration)
        return {
            cookie_name: item.cookie_name,
            cookie_domain: item.cookie_domain,
            category: item.category,
            description: item.description,
            meta_data: {
                expires_at: meta_data_expiry.expires_at,
                duration: meta_data_expiry.duration,
                requestChain: { sourceUrls: item.sources, type: item.source_type }
            },
            added_by_source: ADDED_BY_USER
        }
    })
    return formatCookie
}

/**
 * Validates that all required CSV headers are present in the uploaded file.
 * Throws an error if any expected header is missing.
 *
 * @function validateCSVHeaders
 * @param {string[]} headers - Headers extracted from the CSV file.
 * @param {string[]} expectedHeaders - List of required header names.
 * @throws {UnexpectedError} When one or more expected headers are missing.
 */
function validateCSVHeaders(headers, expectedHeaders) {
    const missing = expectedHeaders.filter((h) => !headers.includes(h))
    if (missing.length > 0) {
        throw UnexpectedError(
            `Invalid CSV headers. Missing: ${missing.join(', ')}. Expected: ${expectedHeaders.join(', ')}`,
            400
        )
    }
}

/**
 * Converts a raw CSV row into a normalized cookie object.
 *
 * - Trims string fields.
 * - Uppercases category.
 * - Splits and cleans the sources list.
 * - Normalizes duration fields (boolean + numeric expiry parts).
 *
 * @function mapCSVRow
 * @param {Object} row - Raw CSV row object.
 * @returns {Object} Mapped cookie object ready for validation.
 */
function mapCSVRow(row) {
    return {
        cookie_name: String(row.cookie_name).trim(),
        category: String(row.category).trim().toUpperCase(),
        description: String(row.description).trim(),
        cookie_domain: String(row.cookie_domain).trim(),
        sources: String(row.sources)
            .split(',')
            .map((source) => source.trim())
            .filter(Boolean),
        source_type: String(row.source_type).trim().toLowerCase(),
        duration: {
            is_session: String(row.is_session).toLowerCase() === 'true',
            expiry: {
                years: Number(row.years) || 0,
                months: Number(row.months) || 0,
                days: Number(row.days) || 0
            }
        }
    }
}

/**
 * Validates a mapped CSV row using the `addCookieSchema` Joi schema.
 * Throws a formatted error if validation fails.
 *
 * @function validateMappedRow
 * @param {Object} mapped - A cookie object created by `mapCSVRow()`.
 * @returns {Object} Joi-validated cookie object.
 * @throws {UnexpectedError} On validation failure.
 */
function validateMappedRow(mapped) {
    const { error, value } = addCookieSchema.validate(mapped, { abortEarly: false })
    if (error) {
        const details = error.details.map((d) => d.message).join(', ')
        throw UnexpectedError(`Invalid row in CSV: ${details}`, 400)
    }
    return value
}

/**
 * Streams and parses a CSV buffer, validating headers and each row while reading.
 *
 * Steps per row:
 *  - Rejects rows with empty or missing values.
 *  - Maps fields using `mapCSVRow()`.
 *  - Validates with `validateMappedRow()`.
 *
 * Stops processing immediately if any error occurs.
 *
 * @async
 * @function parseCSV
 * @param {Buffer} fileBuffer - Raw CSV file content.
 * @param {string[]} expectedHeaders - Required CSV header names.
 * @returns {Promise<Array<Object>>} Array of validated cookie objects.
 */
function parseCSV(fileBuffer, expectedHeaders) {
    return new Promise((resolve, reject) => {
        const results = []
        let finished = false
        const readable = Readable.from(fileBuffer)
        const parser = csv()

        function fail(err) {
            if (finished) {
                return
            }
            finished = true
            parser.destroy()
            reject(err)
        }

        readable.pipe(parser)

        parser.on('headers', (headers) => {
            try {
                validateCSVHeaders(headers, expectedHeaders)
            } catch (err) {
                fail(err)
            }
        })

        parser.on('data', (row) => {
            try {
                if (Object.values(row).some((cell) => cell == null || String(cell).trim() === '')) {
                    throw UnexpectedError(`Empty cell found in row: ${JSON.stringify(row)}`, 400)
                }

                const mapped = mapCSVRow(row)
                const validated = validateMappedRow(mapped)
                results.push(validated)
            } catch (err) {
                fail(err)
            }
        })

        parser.on('end', () => {
            if (!finished) {
                finished = true
                resolve(results)
            }
        })

        parser.on('error', (err) => {
            fail(UnexpectedError(`Error reading CSV file: ${err.message}`, 400))
        })
    })
}

export { addCookiesToDB, addCookiesViaCSV }
