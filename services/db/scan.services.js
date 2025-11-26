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
import { INTERNAL_SERVER_ERROR } from '../constants.js'

// Create
async function createScan(data) {
    try {
        const newScan = await prisma.scan.create({
            data
        })
        return newScan
    } catch (error) {
        throw UnexpectedError('Error in creating entry', 500, {
            message: 'Error creating scan',
            data: String(error)
        })
    }
}

// Read
async function getScanById(scanId, domainId, prismaTransaction = '') {
    try {
        const dbClient = prismaTransaction || prisma
        const scan = await dbClient.scan.findUnique({
            where: {
                scan_id: scanId,
                domain_id: domainId
            }
        })
        if (!scan) {
            throw NotFoundError(
                `No record found with this scan_id: ${scanId}`,
                404
            )
        }
        return scan
    } catch (error) {
        if (error.name && error.name === 'NotFoundError') {
            throw error
        }
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025'
        ) {
            throw NotFoundError(
                `No record found with this id: ${scanId}`,
                404,
                { data: String(error) }
            )
        }
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            message: 'Error finding scan',
            data: String(error)
        })
    }
}

async function updateScan(scanId, data) {
    try {
        const updatedScan = await prisma.scan.update({
            where: { scan_id: scanId },
            data
        })
        return updatedScan
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025'
        ) {
            throw NotFoundError(`No record found with this id: ${scanId}`, 404)
        }
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            data: String(error),
            id: scanId
        })
    }
}

/**
 * Fetches a paginated list of scans for a given domain.
 *
 * @async
 * @function getAllScans
 * @param {string} domainId - The ID of the domain to fetch scans for.
 * @param {number} [page=1] - The page number for pagination (default is 1).
 * @param {number} [pageSize=10] - The number of scans to return per page (default is 10).
 * @param {('asc'|'desc')} [orderBy='desc'] - The order of the results based on the creation date (default is 'desc').
 * @param {string} [status='completed'] - (Optional) The status of scans, such as 'completed', 'failed', etc.
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 *  - {Array<Object>} scans - The list of scan objects, each containing:
 *      - {string} scan_id - The unique identifier of the scan.
 *      - {string} status - The status of the scan.
 *      - {Date} created_at - The timestamp when the scan was created.
 *      - {Date} updated_at - The timestamp when the scan was last updated.
 *  - {number} total - The total number of scans for the domain.
 *  - {number} page - The current page number.
 *  - {number} page_size - The number of scans per page.
 *  - {number} total_pages - The total number of pages based on the total scans and pageSize.
 *
 * @throws {UnexpectedError} Throws an UnexpectedError if there is an issue fetching the scans.
 */
async function getAllScans(
    domainId,
    page = 1,
    pageSize = 10,
    status,
    archived ,
    orderBy = 'desc'
) {
    const offset = (page - 1) * pageSize
    try {
        const condition = {
            domain_id: domainId,
            ...(status !== '' && { status })
        }
        
        if (archived === 'false') {
            // Show only non-archived (active) scans
            condition.archived_at = null
        } else if (archived === 'true') {
            // Show only archived scans
            condition.archived_at = { not: null }
        }
        // if archived === 'all', show both archived and non-archived (no additional filter)
        const total = await prisma.scan.count({
            where: condition
        })
        const scans = await prisma.scan.findMany({
            where: condition,
            skip: offset,
            take: pageSize,
            orderBy: { created_at: orderBy },
            select: {
                scan_id: true,
                name: true,
                status: true,
                archived_at: true,
                archived_by: true,
                created_at: true,
                updated_at: true,
                meta_data: true
            }
        })
        return {
            scans,
            total,
            page,
            page_size: pageSize,
            total_pages: Math.ceil(total / pageSize)
        }
    } catch (error) {
        console.log('error in getAllScans', error)
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            message: 'Error fetching scans',
            data: String(error)
        })
    }
}

async function updateScanArchival(scanId, archivedAt, archivedBy, prismaTransaction = '') {
    try {
        const dbClient = prismaTransaction || prisma
        const updatedScan = await dbClient.scan.update({
            where: { scan_id: scanId },
            data: {
                archived_at: archivedAt,
                archived_by: archivedBy
            },
            select: {
                scan_id: true,
                archived_at: true,
                archived_by: true
            }
        })
        return updatedScan
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new NotFoundError(`No record found with this id: ${scanId}`, 404)
        }
        throw new UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            data: String(error),
            id: scanId
        })
    }
}

export { createScan, getScanById, getAllScans, updateScan, updateScanArchival }
