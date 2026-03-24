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

import { Prisma } from '@prisma/client'
import prisma from '../config.js'
import { UnexpectedError, NotFoundError } from '../../custom_error.js'
import { INTERNAL_SERVER_ERROR } from '../../constants.js'

// Create
async function createCookieMaster(data) {
    try {
        const newCookieMaster = await prisma.cookieMaster.create({
            data
        })
        return newCookieMaster
    } catch (error) {
        console.log('Error in create CookieMaster', error)
        throw UnexpectedError('Error in creating entry', 500, {
            message: 'Error creating cookieMaster createCookieMaster',
            data: String(error)
        })
    }
}

// Read
async function getCookieMasterById(cookieMasterId) {
    try {
        const cookieMaster = await prisma.cookieMaster.findUnique({
            where: { cookie_master_id: cookieMasterId }
        })
        return cookieMaster
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw NotFoundError(`No record found with this id: ${cookieMasterId}`, 404, { data: String(error) })
        }
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            message: 'Error finding cookieMaster',
            data: String(error)
        })
    }
}

// Read
async function getCookieMasterByName(cookieDomain, cookieName, domainId) {
    try {
        const cookieMaster = await prisma.cookieMaster.findUnique({
            where: {
                name_domain_id_cookie_domain: {
                    // Use the composite unique key for [name, domain_id]
                    name: cookieName,
                    domain_id: domainId,
                    cookie_domain: cookieDomain
                }
            }
        })
        if (!cookieMaster) {
            throw NotFoundError(`No record found with name: ${cookieName}`, 404)
        }
        return cookieMaster
    } catch (error) {
        console.log('getCookieMasterByName', error.name, error)
        if (error.name && error.name === 'NotFoundError') {
            console.log('In NotFoundError for getCookieMasterByName')
            throw error
        }
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            message: 'Error finding cookie',
            data: String(error)
        })
    }
}
async function updateCookieMaster(domainId, cookieMasterId, dataToUpdate, prismaTransaction = '') {
    try {
        const dbClient = prismaTransaction || prisma
        const updatedCookieMaster = await dbClient.cookieMaster.update({
            where: {
                cookie_master_id: cookieMasterId,
                domain_id: domainId
            },
            data: dataToUpdate
        })
        return updatedCookieMaster
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw NotFoundError(`No record found with this id: ${cookieMasterId}`, 404)
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'){
            throw UnexpectedError('A cookie with same name and domain already exists.', 400)
        }
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            data: String(error),
            id: cookieMasterId
        })
    }
}
// Read all with pagination
async function getAllCookieMasters(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize
    try {
        const total = await prisma.CookieMaster.count()
        const cookieMasters = await prisma.cookieMaster.findMany({
            skip,
            take: pageSize
        })
        return {
            data: cookieMasters,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        }
    } catch (error) {
        console.error('Error fetching cookieMasters:', error)
        throw error
    }
}
export {
    createCookieMaster,
    getCookieMasterById,
    getCookieMasterByName,
    updateCookieMaster,
    getAllCookieMasters
}
