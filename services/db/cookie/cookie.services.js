import { Prisma } from '@prisma/client'
import prisma from '../config.js'
import { UnexpectedError, NotFoundError } from '../../custom_error.js'
import { INTERNAL_SERVER_ERROR } from '../../constants.js'
import { ADDED_BY_USER } from '../../constants.js'
import { getDomainById } from '../domain.services.js'
import { handleServiceError } from '../../utils.services.js'
import { logger } from '../../logger/instrumentation.services.js'
// Create
async function createCookie(data) {
    try {
        const newCookie = await prisma.cookie.create({
            data
        })
        return newCookie
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw UnexpectedError('A cookie with same name and domain already exists.', 400)
        }
        throw UnexpectedError('Error in creating entry', 500, {
            message: 'Error creating cookie',
            data: String(error)
        })
    }
}

// Read
async function getCookieById(cookie_id) {
    try {
        const cookie = await prisma.cookie.findUnique({
            where: { cookie_id }
        })
        return cookie
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw NotFoundError(`No record found with this id: ${cookie_id}`, 404, { data: String(error) })
        }
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            message: 'Error finding cookie',
            data: String(error)
        })
    }
}

/**
 * Fetches all `cookie_master_id` values for a given `scan_id`.
 *
 * This function retrieves the `cookie_master_id` values from the `cookie` table
 * based on the provided `scan_id`. It supports an optional `prismaTransaction`
 * parameter to allow transactional database operations.
 *
 * @param {string} scanId - The ID of the scan to filter cookies by.
 * @param {object} [prismaTransaction] - Optional Prisma transaction client. Defaults to the global `prisma` instance.
 * @returns {Promise<string[]>} A promise that resolves to a list of `cookie_master_id` values.
 */

async function getCookieMasterIdsByScanId(scanId, prismaTransaction = '') {
    try {
        const dbClient = prismaTransaction || prisma
        const cookies = await dbClient.cookie.findMany({
            where: { scan_id: scanId },
            select: { cookie_master_id: true }
        })

        return cookies.map((cookie) => cookie.cookie_master_id)
    } catch (error) {
        console.error('Error in getCookieMasterIdsByScanId values:', error)
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            data: String(error),
            scanId
        })
    }
}
// Update
async function updateCookie(cookieId, scanId, data) {
    try {
        const updatedCookie = await prisma.cookie.update({
            where: { cookie_id: cookieId, scan_id: scanId },
            data
        })
        return updatedCookie
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw NotFoundError(`No record found with this id: ${cookieId}`, 404)
        }
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            data: String(error),
            id: cookieId
        })
    }
}

async function deleteCookie(cookieId, domainId, userId) {
    const logDict = {
        service: 'CookiesDelete',
        reference_id: userId,
        reference_type: 'UserID',
        event_name: 'CookiesDelete',
        details: {
            user_id: userId,
            domain_id: domainId,
            cookie_id: cookieId
        }
    }
    const result = {
        message: 'Success',
        status_code: 200
    }
    logger('info', 'Invoked', logDict)
    try {
        await getDomainById(domainId)
        await prisma.cookie.deleteMany({
            where: {
                cookie_id: cookieId,
                added_by_source: ADDED_BY_USER
            }
        })
        logger('info', 'Success', logDict, true)
        return result
    } catch (error) {
        logger('warn', 'Failed', logDict, true)
        return handleServiceError(result, error, {}, deleteCookie)
    }
}

export { createCookie, getCookieById, getCookieMasterIdsByScanId, updateCookie, deleteCookie }
