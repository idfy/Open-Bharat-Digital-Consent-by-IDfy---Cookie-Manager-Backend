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

import prisma from './config.js'
import { UnexpectedError } from '../custom_error.js'
import { INTERNAL_SERVER_ERROR, INSTRUMENTER_LOG_FALSE } from '../constants.js'
import { buildCreatedAtFilter } from '../utils.services.js'
import { logger } from '../logger/instrumentation.services.js'
// Create
async function createSubmittedCookieConsent(data) {
    const start = process.hrtime.bigint() // Capture high-resolution start time
    const logDict = {
        service: 'CookieConsent.DbCall',
        reference_id: data['data_principal_id'],
        reference_type: 'DataPrincipalID',
        event_name: '',
        ou_id: data['banner_id']
    }
    const opts = {
        'tags': {
            'volume': {}
        },
        log: INSTRUMENTER_LOG_FALSE
    }
    logger('info', 'Invoked', logDict, true, opts)
    try {
        const newSubmittedCookieConsent = await prisma.submittedCookieConsent.create({
            data
        })
        const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000 // Convert nanoseconds to ms
        const units = durationMs.toFixed(2)
        opts['tags']['tat'] = {
            units
        }

        logDict['event_name'] = units
        logger('info', 'Success', logDict, true, opts)
        return newSubmittedCookieConsent
    } catch (error) {
        const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000 // Convert nanoseconds to ms
        opts['tags']['tat'] = {
            'units': durationMs.toFixed(2)
        }
        logDict['details'] = {
            error: String(error)
        }
        logDict['event_name'] = 'InsertError'
        logger('error', 'Exception', logDict, true, opts)
        throw UnexpectedError('Error in creating entry', 500, {
            message: 'Error creating submittedcookieconsent',
            data: String(error)
        })
    }
}
/**
 * Fetches a paginated list of submitted cookie consents with optional filtering by time range and banner IDs.
 *
 * @async
 * @function getAllSubmittedCookieConsents
 * @param {Object} paginationData - The pagination data and filter parameters.
 * @param {number} paginationData.page - The page number for pagination (default is 1).
 * @param {number} paginationData.pageSize - The number of records per page (default is 10).
 * @param {('asc'|'desc')} paginationData.orderBy - The order of the results based on creation date (default is 'desc').
 * @param {string} [paginationData.startTime] - The start time for filtering consents by creation date (inclusive).
 * @param {string} [paginationData.endTime] - The end time for filtering consents by creation date (inclusive).
 * @param {string[]} bannerIds - An optional array of banner UUIDs to filter the consent logs. If empty, no filtering by banner.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 *  - {Array<Object>} data - The list of consent objects, each containing:
 *      - {string} id - The unique identifier of the consent submission.
 *      - {string} banner_id - The unique identifier of the associated banner.
 *      - {string} data_principal_id - The unique identifier of the data principal (user).
 *      - {Object} submitted_data - The consent data submitted by the user.
 *      - {Date} created_at - The timestamp when the consent was created.
 *  - {number} total - The total number of consent records matching the filters.
 *  - {number} page - The current page number.
 *  - {number} page_size - The number of consent records per page.
 *  - {number} total_pages - The total number of pages based on the total number of records and pageSize.
 *
 * @throws {UnexpectedError} Throws an UnexpectedError if there is an issue fetching the consents from the database.
 */

async function getAllSubmittedCookieConsents(paginationData, bannerIds) {
    const { page, pageSize, orderBy, startTime, endTime } = paginationData
    const offset = (page - 1) * pageSize
    try {
        const durationLogic = buildCreatedAtFilter(startTime, endTime)
        const condition = {
            created_at: durationLogic,
            ...(bannerIds.length > 0 && { banner_id: { in: bannerIds } }) // Check for multiple bannerIds
        }
        const total = await prisma.submittedCookieConsent.count({
            where: condition
        })
        const submittedCookieConsent = await prisma.submittedCookieConsent.findMany({
            where: condition,
            skip: offset,
            take: pageSize,
            orderBy: { created_at: orderBy },
            select: {
                id: true,
                banner_id: true,
                data_principal_id: true,
                submitted_data: true,
                metadata: true,
                created_at: true
            }
        })
        return {
            data: submittedCookieConsent,
            total,
            page,
            page_size: pageSize,
            total_pages: Math.ceil(total / pageSize)
        }
    } catch (error) {
        console.error('Error fetching submittedCookies:', error)
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            message: 'Error  fetching getAllSubmittedCookieConsents',
            data: String(error)
        })
    }
}
export { createSubmittedCookieConsent, getAllSubmittedCookieConsents }
