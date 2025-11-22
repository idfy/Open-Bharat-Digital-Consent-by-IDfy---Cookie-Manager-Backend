import { Prisma } from '@prisma/client'
import prisma from './config.js'
import { UnexpectedError, NotFoundError } from '../custom_error.js'
import { INTERNAL_SERVER_ERROR, ENGLISH_ENUM_VALUE } from '../constants.js'

// Create
async function createLanguage(data) {
    try {
        const newLanguage = await prisma.language.create({
            data
        })
        return newLanguage
    } catch (error) {
        throw UnexpectedError('Error in creating entry', 500, {
            message: 'Error creating language',
            data: String(error)
        })
    }
}

async function getLanguageByScanId(scanId, language = ENGLISH_ENUM_VALUE) {
    try {
        const languageDetails = await prisma.language.findUnique({
            where: {
                scan_id_language: { scan_id: scanId, language } // Named constraint
            }
        })
        if (!languageDetails) {
            throw NotFoundError(`No record found with this scan_id: ${scanId} in language`, 404)
        }
        return languageDetails
    } catch (error) {
        console.log(error)
        if (error.name && error.name === 'NotFoundError') {
            throw error
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw NotFoundError(`No record found with this scan_id: ${scanId} in language`, 404, {
                data: String(error)
            })
        }
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, { message: 'Error finding language', data: String(error) })
    }
}

// Read all with pagination
async function getAllLanguagesPerScan(scanId, page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize
    try {
        const total = await prisma.language.count({ where: { scan_id: scanId } })
        const languages = await prisma.language.findMany({
            skip,
            take: pageSize,
            where: { scan_id: scanId }
        })
        return {
            data: languages,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        }
    } catch (error) {
        console.error('Error fetching languages:', error)
        throw error
    }
}

// Update
async function updateLanguage(language_id, data) {
    try {
        const updatedLanguage = await prisma.language.update({
            where: { language_id },
            data
        })
        return updatedLanguage
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw NotFoundError(`No record found with this id: ${language_id}`, 404)
        }
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, { data: String(error), id: language_id })
    }
}

export { getLanguageByScanId, createLanguage, getAllLanguagesPerScan, updateLanguage }
