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

import { Prisma } from '@prisma/client'
import prisma from './config.js'
import { UnexpectedError, NotFoundError } from '../custom_error.js'
import { INTERNAL_SERVER_ERROR, INSTRUMENTER_LOG_FALSE } from '../constants.js'
import { logger } from '../logger/instrumentation.services.js'
// Create
async function createBanner(data) {
    try {
        const newBanner = await prisma.banner.create({
            data
        })
        return newBanner
    } catch (error) {
        console.log(error)
        throw UnexpectedError('Error in creating entry', 500, {
            message: 'Error creating banner',
            data: String(error)
        })
    }
}

// Read
async function getBannerById(bannerId, status = '', prismaTransaction = '') {
    const logDict = {
        service: 'FetchBanner.DBCall',
        reference_id: bannerId,
        reference_type: 'BannerId',
        event_name: '',
        ou_id: bannerId
    }
    const start = process.hrtime.bigint() // Capture high-resolution start time
    const opts = {
        'tags': {
            'volume': {}
        },
        log: INSTRUMENTER_LOG_FALSE
    }
    logger('info', 'Invoked', logDict, true, opts)
    try {
        const dbClient = prismaTransaction || prisma
        const banner = await dbClient.banner.findUnique({
            where: {
                banner_id: bannerId,
                ...(status !== '' && {
                    status
                })
            },
            include: {
                domain: true
            }
        })
        const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000 // Convert nanoseconds to ms
        opts['tags']['tat'] = {
            'units': durationMs.toFixed(2)
        }
        logger('info', 'Success', logDict, true, opts)
        return banner
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000 // Convert nanoseconds to ms
            opts['tags']['tat'] = {
                'units': durationMs.toFixed(2)
            }
            logger('warn', 'Failed', logDict, true, opts)
            throw NotFoundError(`No record found with this id: ${bannerId}`, 404, { data: String(error) })
        }
        const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000 // Convert nanoseconds to ms
        opts['tags']['tat'] = {
            'units': durationMs.toFixed(2)
        }
        logger('error', 'Exception', logDict, true, opts)
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            message: 'Error finding banner',
            data: String(error)
        })
    }
}
async function getActiveBannerByDomainId(domainId, prismaTransaction = '') {
    try {
        const dbClient = prismaTransaction || prisma
        const banner = await dbClient.banner.findMany({
            where: { domain_id: domainId, status: 'active' },
            select: {
                banner_id: true,
                scan_id: true,
                name: true,
                domain_id: true,
                domain: true
            }
        })
        if (banner.length === 0) {
            throw NotFoundError(`No record found with name: ${domainId}`, 404)
        }
        return banner[0]
    } catch (error) {
        if (error.name && error.name === 'NotFoundError') {
            throw error
        }
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            message: 'Error finding banner by domain id',
            data: String(error)
        })
    }
}

async function getActiveBanners(whereCondition, prismaTransaction = '') {
    try {
        const dbClient = prismaTransaction || prisma
        const activeBanners = await dbClient.banner.findMany({
            where: {
                ...whereCondition,
                status: 'active',
                archived_at: null
            },
            select: {
                banner_id: true,
                name: true,
                domain_id: true,
                status: true
            }
        })
        return activeBanners
    } catch (error) {
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            message: 'Error finding active banners',
            data: String(error)
        })
    }
}
/**
 * Fetches a paginated list of banners for a given domain.
 *
 * @async
 * @function getAllBanners
 * @param {string} domainId - The ID of the domain to fetch banners for.
 * @param {number} [page=1] - The page number for pagination (default is 1).
 * @param {number} [pageSize=10] - The number of banners to return per page (default is 10).
 * @param {('asc'|'desc')} [orderBy='desc'] - The order of the results based on the creation date (default is 'desc').
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 *  - {Array<Object>} domains - The list of banner objects, each containing:
 *      - {string} banner_id - The unique identifier of the banner.
 *      - {string} scan_id - The unique identifier of the scan related to the banner.
 *      - {string} company_process_code - The process code associated with the company.
 *      - {string} company_process_version - The version of the company process.
 *      - {Date} created_at - The timestamp when the banner was created.
 *      - {Date} updated_at - The timestamp when the banner was last updated.
 *  - {number} total - The total number of banners for the domain.
 *  - {number} page - The current page number.
 *  - {number} page_size - The number of banners per page.
 *  - {number} totalPages - The total number of pages based on the total banners and pageSize.
 *
 * @throws {UnexpectedError} Throws an UnexpectedError if there is an issue fetching the banners.
 */
async function getAllBanners(domainId, page = 1, pageSize = 10, orderBy = 'desc', archived = 'false') {
    const offset = (page - 1) * pageSize

    const whereClause = { domain_id: domainId }

    if (archived === 'false') {
        // Show only non-archived (active) banners
        whereClause.archived_at = null
    } else if (archived === 'true') {
        // Show only archived banners
        whereClause.archived_at = { not: null }
    }
    // if archived === 'all', show both archived and non-archived (no additional filter)

    try {
        const total = await prisma.banner.count({
            where: whereClause
        })
        const banners = await prisma.banner.findMany({
            where: whereClause,
            skip: offset,
            take: pageSize,
            orderBy: { created_at: orderBy },
            select: {
                banner_id: true,
                scan_id: true,
                template_id: true,
                name: true,
                status: true,
                archived_at: true,
                archived_by: true,
                created_at: true,
                updated_at: true
            }
        })
        return {
            banners,
            total,
            page,
            page_size: pageSize,
            total_pages: Math.ceil(total / pageSize)
        }
    } catch (error) {
        console.error('Error fetching banners:', error)
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            message: 'Error fetching banners',
            data: String(error)
        })
    }
}

// Update
async function updateBanner(domainId, bannerId, data, prismaTransaction = '') {
    try {
        const dbClient = prismaTransaction || prisma
        const updatedBanner = await dbClient.banner.update({
            where: { banner_id: bannerId, domain_id: domainId },
            data: {
                status: data['status'],
                ...(data['templateId'] !== '' && {
                    template_id: data['templateId']
                })
            },
            select: {
                banner_id: true,
                scan_id: true,
                name: true,
                domain_id: true
            }
        })
        return updatedBanner
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw NotFoundError(`No record found with this id: ${bannerId}`, 404)
        }
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            data: String(error),
            id: bannerId
        })
    }
}

async function getCountOfBannersUsingTemplate(templateId) {
    try {
        const count = await prisma.banner.count({
            where: { template_id: templateId }
        })
        if (count > 0) {
            throw UnexpectedError('Template cannot be edited because it is currently used by a banner', 409)
        }
    } catch (error) {
        if (error.name && error.name === 'UnexpectedError') {
            throw error
        }
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            data: String(error),
            id: templateId
        })
    }
}

async function updateBannerArchival(bannerId, archivedAt, archivedBy, prismaTransaction = '') {
    try {
        const dbClient = prismaTransaction || prisma
        const updatedBanner = await dbClient.banner.update({
            where: { banner_id: bannerId },
            data: {
                archived_at: archivedAt,
                archived_by: archivedBy
            },
            select: {
                banner_id: true,
                archived_at: true,
                archived_by: true
            }
        })
        return updatedBanner
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw NotFoundError(`No record found with this id: ${bannerId}`, 404)
        }
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            data: String(error),
            id: bannerId
        })
    }
}

export {
    createBanner,
    getBannerById,
    updateBanner,
    updateBannerArchival,
    getAllBanners,
    getActiveBannerByDomainId,
    getActiveBanners,
    getCountOfBannersUsingTemplate
}
