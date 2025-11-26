/**
 * Privy-OpenCMS
 * Copyright (c) 2025 Baldor Technologies Private Limited (IDfy)
 * 
 * This software is licensed under the Privy Public License.
 * See LICENSE.md for the full terms of use.
 * 
 * Unauthorized copying, modification, distribution, or commercial use
 * is strictly prohibited without prior written permission from IDfy.
 */

import { UnexpectedError, ERROR_TYPE_SET } from './custom_error.js'
import { INTERNAL_SERVER_ERROR_DICT, INTERNAL_SERVER_ERROR, ARCHIVAL_ACCESS_ROLES, ROLE_DISPLAY_NAMES, SCAN_ACCESS_ROLES } from './constants.js'
import get from 'lodash/get.js'

/**
 * Pauses execution for a specified number of milliseconds.
 *
 * @param {number} ms - The number of milliseconds to sleep.
 * @returns {Promise<void>} A Promise that resolves after the specified time.
 */
async function customSleep(ms) {
    await new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Parses a given URL string into protocol, hostname, domain, and subdomain components.
 *
 * @param {string} urlString - The URL string to be parsed.
 * @returns {Object} An object containing the parsed URL components.
 * @property {string} protocol - The protocol of the URL (e.g., "https").
 * @property {string} hostname - The full hostname, including any subdomains (e.g., "sub.example.com").
 * @property {string} domain - The main domain and top-level domain (e.g., "example.com").
 * @property {string} subdomain - The subdomain portion of the hostname, if present (e.g., "sub").
 * @property {string} base_url - The base URL without path or query parameters.
 * @throws {Error} Will throw an error if the input URL is invalid.
 *
 */
function parseUrl(urlString) {
    try {
        const url = new URL(urlString)
        const protocol = url.protocol.replace(':', '')
        const { hostname } = url
        const hostnameParts = hostname.split('.')
        let domain = ''
        let subdomain = ''
        if (hostnameParts.length > 2) {
            subdomain = hostnameParts.slice(0, -2).join('.')
            domain = hostnameParts.slice(-2).join('.')
        } else {
            domain = hostname
        }
        const baseUrl = `${protocol}://${hostname}`

        return {
            protocol,
            hostname,
            subdomain,
            domain,
            base_url: baseUrl
        }
    } catch (error) {
        console.error('Invalid URL:', error)
        throw UnexpectedError('Error in parsing URL', 500, {
            data: urlString,
            error: String(error)
        })
    }
}

/**
 * Handles an error by updating the `result` dictionary with an appropriate status code and message.
 * If the error's name is present in the predefined `ERROR_TYPE_SET`, it customizes the response
 * based on the error details; otherwise, it returns a default internal server error response.
 *
 * @param {Object} result - The result dictionary containing the response information.
 * @property {number} result.status_code - The HTTP status code for the response.
 * @property {string} result.message - The message to return in the response.
 *
 * @param {any} error - The error, which may be an object or any other type. When an object, its
 *                      properties `name`, `status_code`, and `message` are checked for a custom response.
 *
 * @param {Object} logDict - The dictionary where log entries may be added for error tracking.
 *
 * @param {string} [name=''] - The name of the function where the error occurred, included in the log for better traceability.
 *
 * @returns {Object} - Returns the updated `result` dictionary with the `status_code` and `message`
 *                     if the error matches a type in `ERROR_TYPE_SET`. If not, returns `INTERNAL_SERVER_ERROR_DICT`
 *                     as a default response.
 */
function handleServiceError(result, error, logDict, name = '') {
    if (ERROR_TYPE_SET.has(error.name)) {
        result.status_code = error.status_code || 500
        result.message = error.message || INTERNAL_SERVER_ERROR
        return result
    }
    if (Object.keys(logDict).length > 0) {
        logDict['details'] = {
            function_name: name,
            error: error.data ?? String(error)
        }
    }
    // logging
    return INTERNAL_SERVER_ERROR_DICT
}

/**
 * Retrieves and validates pagination and ordering parameters from the request query.
 *
 * @param {Object} req - The request object, expected to contain `query` with `page`, `page_size`, `start_time`,`end_time`and `order_by`.
 * @returns {Object} - An object containing validated `page`, `pageSize`, `startTime`, `endTime` and `orderBy` properties.
 */

function getPaginationParams(req) {
    let page = parseInt(get(req, 'query.page', 1), 10)
    let pageSize = parseInt(get(req, 'query.page_size', 10), 10)
    const orderBy = get(req, 'query.order_by', 'desc').toLowerCase()
    page = Math.max(Math.min(page, 100), 1)
    pageSize = Math.max(Math.min(pageSize, 100), 1)
    const validOrderBy = ['asc', 'desc']
    const finalOrderBy = validOrderBy.includes(orderBy) ? orderBy : 'desc'
    const startTime = get(req, 'query.start_time', undefined)
    // get(req, 'query.start_date')?.trim() || undefined
    const endTime = get(req, 'query.end_time', undefined)
    return {
        page,
        pageSize,
        orderBy: finalOrderBy,
        startTime,
        endTime
    }
}
/**
 * Creates date conditions for a Prisma 'created_at' filter based on optional time parameters.
 *
 * @param {string | undefined} startTime - ISO date string for the start time (inclusive)
 * @param {string | undefined} endTime - ISO date string for the end time (inclusive)
 * @returns {Object} Date conditions object or empty object if no times provided
 */
function buildCreatedAtFilter(startTime, endTime) {
    // Early return if no time constraints provided
    if (!startTime && !endTime) {
        return {}
    }
    const filter = {
        ...(startTime && { gte: new Date(startTime) }),
        ...(endTime && { lte: new Date(endTime) })
    }
    return filter
}

/**
 * Splits an array of items into smaller batches of a specified size.
 *
 * @param {Array} items - The array of items to batch.
 * @param {number} [batchSize=100] - The maximum number of items per batch.
 * @returns {Array<Array>} - An array of batches, where each batch is an array of items.
 *
 * @example
 * const batches = createBatches([1, 2, 3, 4, 5], 2);
 * // Result: [[1, 2], [3, 4], [5]]
 */
function createBatches(items, batchSize = 100) {
    const batches = []
    for (let i = 0; i < items.length; i += batchSize) {
        batches.push(items.slice(i, i + batchSize))
    }
    return batches
}

/**
 * Executes a function with retry and exponential backoff in case of failure.
 *
 * @param {Function} fn - The asynchronous function to execute.
 * @param {number} [maxRetries=3] - Maximum number of retry attempts.
 * @param {number} [delayMs=500] - Initial delay in milliseconds for backoff calculation.
 * @returns {Promise<*>} - The result of the successful function execution.
 * @throws {Error} - Throws the last error if all retries fail.
 *
 * @example
 * const result = await retryWithBackoff(() => fetchData(), 5, 1000);
 */
async function retryWithBackoff(fn, maxRetries = 3, delayMs = 500) {
    let attempt = 0
    while (attempt <= maxRetries) {
        const success = await tryExecute(fn, attempt, maxRetries, delayMs)
        if (success.executed) {
            return success.result
        }
        attempt++
    }
    throw new Error('All retry attempts failed.')
}
/**
 * Attempts to execute a function once with backoff handling.
 *
 * @param {Function} fn - The asynchronous function to execute.
 * @param {number} attempt - The current attempt number.
 * @param {number} maxRetries - The maximum number of retries allowed.
 * @param {number} delayMs - The base delay in milliseconds.
 * @returns {Promise<{executed: boolean, result?: *}>} - The result object indicating success or failure.
 * @throws {Error} - Throws the error if the final attempt fails.
 *
 * @example
 * const result = await tryExecute(fetchData, 0, 3, 500);
 */
async function tryExecute(fn, attempt, maxRetries, delayMs) {
    try {
        const result = await fn()
        return { executed: true, result }
    } catch (error) {
        if (attempt === maxRetries) {
            throw error // Final failure
        }

        const backoff = delayMs * Math.pow(2, attempt)
        console.warn(`Retrying attempt ${attempt + 1} after ${backoff}ms`)

        await customSleep(backoff)

        return { executed: false }
    }
}

export function getRoleDisplayName(role) {
    return ROLE_DISPLAY_NAMES[role] || role
}

/**
 * Get comma-separated display names for archival access roles
 * @returns {string} Comma-separated user-friendly role names
 */
export function getArchivalRoles() {
    return getRoles(ARCHIVAL_ACCESS_ROLES)
}

export function getScanRoles() {
    return getRoles(SCAN_ACCESS_ROLES)
}

function getRoles(roles) {
    if (roles.length > 0) {
        return roles.map(role => getRoleDisplayName(role)).join(', ')
    } else {
        return 'No roles configured'
    }
}
export function userHasRole(currentUser, roleSet) {
    if (
        !currentUser ||
        !currentUser.roles ||
        !Array.isArray(currentUser.roles)
    ) {
        return false
    }

    return currentUser.roles.some(role => roleSet.has(role.toLowerCase()))
}

export {
    customSleep,
    parseUrl,
    handleServiceError,
    getPaginationParams,
    buildCreatedAtFilter,
    retryWithBackoff,
    createBatches
}
