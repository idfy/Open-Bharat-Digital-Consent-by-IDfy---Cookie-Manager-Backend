import prisma from '../config.js'
import { createCookie } from './cookie.services.js'
import { getCookieMasterByName, createCookieMaster, updateCookieMaster } from './cookie_master.services.js'
import { UnexpectedError, NotFoundError } from '../../custom_error.js'
import { INTERNAL_SERVER_ERROR, ENGLISH_ENUM_VALUE, ADDED_BY_SCAN } from '../../constants.js'
import { createCookieMasterLanguage, updateCookieMasterLanguage } from './cookie_master_language.services.js'
import { handleServiceError } from '../../utils.services.js'
import { logger } from '../../logger/instrumentation.services.js'

async function addScanCookieResults(cookies, scanId, domainId) {
    try {
        const cookieEntries = await prisma.$transaction(function processBatch() {
            return Promise.all(
                cookies.map(function processSingleCookie(cookie) {
                    return processCookie(cookie, scanId, domainId)
                })
            )
        })
        return cookieEntries
    } catch (error) {
        console.error(`Transaction rolled back - Failed to process batch of ${cookies.length} cookies`)
        console.error('Failure reason:', error)
        if (error.name === 'UnexpectedError') {
            throw error
        }
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            message: 'Error adding cookies to database',
            data: String(error)
        })
    }
}

async function processCookie(cookie, scanId, domainId) {
    try {
        const cookieMaster = await findOrCreateCookieMaster(cookie, domainId)
        const cookieData = await createCookie({
            scan_id: scanId,
            cookie_master_id: cookieMaster['cookie_master_id'],
            meta_data: cookie['meta_data'],
            added_by_source: cookie['added_by_source'] || ADDED_BY_SCAN
        })
        cookie['id'] = cookieData['cookie_id']
        cookie['master_id'] = cookieMaster['cookie_master_id']
        return cookie
    } catch (error) {
        console.error(`Failed to process cookie: ${cookie.cookie_name} - ${error.message}`)
        throw error
    }
}

async function findOrCreateCookieMaster(cookie, domainId, language = ENGLISH_ENUM_VALUE) {
    const cookieName = cookie.cookie_name
    const cookieDomain = cookie.cookie_domain
    try {
        const data = await getCookieMasterByName(cookieDomain, cookieName, domainId)
        return data
    } catch (error) {
        console.log('findOrCreateCookieMaster', error.name)
        if (error.name && error.name === 'NotFoundError') {
            console.log(`CookieMaster not found for ${cookieName}. Creating a new entry.`)
            const data = await createCookieMaster({
                name: cookieName,
                domain_id: domainId,
                cookie_domain: cookieDomain,
                category: cookie.category.toUpperCase()
            })
            const languageData = await createCookieMasterLanguage({
                cookie_master_id: data['cookie_master_id'],
                language,
                name: cookieName,
                description: cookie.description,
                domain_id: domainId
            })
            return languageData
        }
        throw error
    }
}

/**
 * Fetches cookie details for a specific scan ID and organizes them by category.
 *
 * This function queries the database to retrieve cookies associated with the given scan ID.
 * It ensures that the cookies have an English (`en`) language mapping in their `CookieMasterLanguage`.
 * The resulting cookies are grouped by their category into an object, where each key represents a category,
 * and the value is an array of cookies belonging to that category.
 *
 * Optionally, it can also include metadata from the scan if `meta_data` is true.
 *
 * @async
 * @function getCookieDetailsByScanId
 * @param {string} scanId - The unique identifier of the scan to fetch cookie details for.
 * @param {Array<string>} [languages=['en']] - An array of language codes to filter cookies based on their language mapping.
 *                                             Defaults to English (`en`).
 * @param {boolean} [meta_data=false] - A flag to include scan metadata in the result. Defaults to `false`.
 * @returns {Promise<Object>} - A Promise that resolves to an object organized by cookie categories and optionally includes scan metadata.
 * The keys are cookie categories (e.g., "ANALYTICS", "NECESSARY"), and the values are arrays of cookie objects.
 * Each cookie object contains the following attributes:
 *   - `meta_data` {Object} - Metadata associated with the cookie.
 *   - `cookie_id` {string} - Unique identifier for the cookie.
 *   - `category` {string} - Category of the cookie (e.g., "ANALYTICS").
 *   - `cookie_master_name` {string} - Name of the cookie master record.
 *   - `cookie_master_id` {string} - Unique identifier for the cookie master record.
 *   - `languages` {Object} - A mapping of languages (`language`) to their details:
 *       - `language_id` {string} - Unique identifier for the language.
 *       - `name` {string} - Name of the cookie in the specific language.
 *       - `description` {string} - Description of the cookie in the specific language.
 *
 * If `meta_data` is `true`, the returned object will also include scan-related metadata, with the following attributes:
 *   - `name` {string} - Name of the scan.
 *   - `status` {string} - Status of the scan.
 *   - `created_at` {string} - Timestamp when the scan was created.
 *   - `updated_at` {string} - Timestamp when the scan was last updated.
 *   - `meta_data` {Object} - Metadata associated with the scan.
 *
 * @throws {Error} Throws an error if there is an issue fetching the cookie details from the database.
 *                 The error will include a message and the error data for debugging.
 */
async function getCookieDetailsByScanId(scanId, languages = [ENGLISH_ENUM_VALUE], meta_data = false) {
    try {
        const cookies = await prisma.cookie.findMany({
            where: {
                scan_id: scanId,
                cookie_master: {
                    CookieMasterLanguage: {
                        some: {
                            language: {
                                in: languages
                            }
                        }
                    }
                }
            },
            select: {
                meta_data: true,
                cookie_id: true,
                added_by_source: true,
                cookie_master: {
                    select: {
                        cookie_master_id: true,
                        cookie_domain: true,
                        name: true,
                        category: true, // Ensure this belongs to cookie_master
                        CookieMasterLanguage: {
                            where: {
                                language: {
                                    in: [ENGLISH_ENUM_VALUE]
                                }
                            },
                            select: {
                                language_id: true,
                                language: true,
                                name: true,
                                description: true
                            }
                        }
                    }
                }
            }
        })
        const results = cookies.reduce((acc, cookie) => {
            const { category } = cookie.cookie_master
            if (!acc[category]) {
                acc[category] = []
            }
            acc[category].push({
                meta_data: cookie.meta_data,
                cookie_id: cookie.cookie_id,
                category,
                added_by_source: cookie.added_by_source,
                cookie_master_name: cookie.cookie_master.name,
                cookie_domain: cookie.cookie_master.cookie_domain,
                cookie_master_id: cookie.cookie_master.cookie_master_id,
                languages: cookie.cookie_master.CookieMasterLanguage.reduce((langs, lang) => {
                    langs[lang.language] = {
                        language_id: lang.language_id,
                        name: lang.name,
                        description: lang.description
                    }
                    return langs
                }, {})
            })
            return acc
        }, {})
        if (meta_data) {
            const scanDetails = await prisma.scan.findUnique({
                where: { scan_id: scanId },
                select: {
                    name: true,
                    status: true,
                    created_at: true,
                    updated_at: true,
                    meta_data: true
                }
            })
            results['scan_details'] = scanDetails
        }
        if (!results) {
            throw NotFoundError(`No record found with this scanId: ${scanId}`, 404)
        }
        return results
    } catch (error) {
        console.error('Error fetching cookie details getCookieDetailsByScanId:', error)
        if (error.name && error.name === 'NotFoundError') {
            throw error
        }
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            message: 'Error fetching cookie details',
            data: String(error)
        })
    }
}

/**
 * Updates cookie categories and descriptions in a transactional manner with controlled concurrency and memory efficiency.
 *
 * @async
 * @function updateCookiesCategoryAndDescription
 * @param {string} domainId - The ID of the domain associated with the cookies.
 * @param {Array<Object>} categories - An array of objects representing categories to update.
 * @param {string} categories[].cookie_master_id - The ID of the `CookieMaster` record to update.
 * @param {string} categories[].category - The new category for the `CookieMaster`.
 * @param {Array<Object>} descriptions - An array of objects representing descriptions to update.
 * @param {string} descriptions[].language_id - The ID of the `CookieMasterLanguage` record to update.
 * @param {string} descriptions[].description - The new description for the `CookieMasterLanguage`.
 * @param {string} userId - The ID of the user performing the update.
 * @returns {Promise<boolean>} Returns `true` if the transaction completes successfully.
 * @throws {Error} Throws known errors from `updateCookieMaster` or `updateCookieMasterLanguage`.
 * @throws {UnexpectedError} Wraps unexpected errors with additional context.
 */
async function updateCookiesCategoryAndDescription(domainId, categories, descriptions, userId) {
    const logDict = {
        service: 'CookiesEdit',
        reference_id: userId,
        reference_type: 'UserID',
        event_name: 'CookiesEdit',
        details: {
            user_id: userId,
            domain_id: domainId,
            categories,
            descriptions
        }
    }
    logger('info', 'Invoked', logDict)
    const BATCH_SIZE = 30
    const results = { status_code: 200, message: 'Success' }
    try {
        await prisma.$transaction(async (prismaTransaction) => {
            for (let i = 0; i < categories.length; i += BATCH_SIZE) {
                const batch = categories.slice(i, i + BATCH_SIZE)
                await Promise.all(
                    batch.map(({ cookie_master_id, category }) =>
                        updateCookieMaster(
                            domainId,
                            cookie_master_id,
                            { category: category.toUpperCase() },
                            prismaTransaction
                        )
                    )
                )
            }
            for (let i = 0; i < descriptions.length; i += BATCH_SIZE) {
                const batch = descriptions.slice(i, i + BATCH_SIZE)
                await Promise.all(
                    batch.map(({ language_id, description }) =>
                        updateCookieMasterLanguage(language_id, { description }, prismaTransaction)
                    )
                )
            }
        })
        logger('info', 'Success', logDict, true)
        return results
    } catch (error) {
        logger('warn', 'Failed', logDict, true)
        console.error('Error updating updateCookiesCategoryAndDescription:', error)
        return handleServiceError(results, error, {}, updateCookiesCategoryAndDescription)
    }
}

export { addScanCookieResults, getCookieDetailsByScanId, updateCookiesCategoryAndDescription }
