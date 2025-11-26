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
async function createDomain(data) {
    try {
        const newDomain = await prisma.domain.create({
            data
        })
        return newDomain
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            throw UnexpectedError('Conflict. Url already exists for the org.', 409, { data: String(error) })
        }
        throw UnexpectedError('Error in creating entry', 500, {
            message: 'Error creating domain',
            data: String(error)
        })
    }
}

// Read
async function getDomainById(domainId) {
    try {
        const domain = await prisma.domain.findUnique({
            where: { domain_id: domainId }
        })
        if (!domain) {
            throw NotFoundError(`No record found with this domain_id: ${domainId}`, 404)
        }
        return domain
    } catch (error) {
        if (error.name && error.name === 'NotFoundError') {
            throw error
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw NotFoundError(`No record found with this domain_id: ${domainId}`, 404, { data: String(error) })
        }
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            message: 'Error finding domain',
            data: String(error)
        })
    }
}

/**
 * Fetches a paginated list of domains for a given organization.
 *
 * @async
 * @function getAllDomains
 * @param {number} [page=1] - The page number for pagination (default is 1).
 * @param {number} [pageSize=10] - The number of domains to return per page (default is 10).
 * @param {('asc'|'desc')} [orderBy='desc'] - The order of the results based on the creation date (default is 'desc').
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 *  - {Array<Object>} domains - The list of domain objects, each containing:
 *      - {string} domain_id - The unique identifier of the domain.
 *      - {string} url - The URL associated with the domain.
 *      - {Date} created_at - The timestamp when the domain was created.
 *      - {Date} updated_at - The timestamp when the domain was last updated.
 *  - {number} total - The total number of domains for the organization.
 *  - {number} page - The current page number.
 *  - {number} page_size - The number of domains per page.
 *  - {number} totalPages - The total number of pages based on the total domains and pageSize.
 *
 * @throws {UnexpectedError} Throws an UnexpectedError if there is an issue fetching the domains.
 */
async function getAllDomains(page = 1, pageSize = 10, orderBy = 'desc') {
    const offset = (page - 1) * pageSize
    try {
        const condition = {}
        const total = await prisma.domain.count({ where: condition })
        const domains = await prisma.domain.findMany({
            where: condition,
            skip: offset,
            take: pageSize,
            orderBy: { created_at: orderBy },
            select: {
                domain_id: true,
                url: true,
                created_at: true,
                updated_at: true
            }
        })
        return {
            domains,
            total,
            page,
            page_size: pageSize,
            total_pages: Math.ceil(total / pageSize)
        }
    } catch (error) {
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            message: 'Error fetching domains',
            data: String(error)
        })
    }
}

export { createDomain, getDomainById, getAllDomains }
