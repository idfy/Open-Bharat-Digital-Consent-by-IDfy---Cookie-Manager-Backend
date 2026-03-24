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
import prisma from './config.js'
import { UnexpectedError, NotFoundError } from '../custom_error.js'
import { INTERNAL_SERVER_ERROR, ENGLISH_ENUM_VALUE } from '../constants.js'

// Create
async function createTemplate({ templateId, name, languages, nonTextConfig, textEntries, status }) {
    try {
        return await prisma.$transaction(async (tx) => {
            const template = await tx.template.create({
                data: {
                    template_id: templateId,
                    name,
                    value: nonTextConfig,
                    languages,
                    status
                }
            })

            await tx.templatesLanguages.createMany({
                data: textEntries.map((e) => ({ ...e, template_id: template.template_id })),
                skipDuplicates: true
            })
            return template
        })
    } catch (error) {
        throw UnexpectedError('Error creating template', 500, {
            message: 'Error creating template',
            data: String(error)
        })
    }
}

/**
 * Fetches a template by template_id  including text entries for specified languages.
 *
 * @param {string} templateId - The template ID.
 * @param {string[]} languages - Array of language codes to fetch text entries for.
 *
 * @returns {Promise<Object>} Template with non-text config and text entries.
 */
async function getTemplateById(templateId, languages = [ENGLISH_ENUM_VALUE]) {
    try {
        const template = await prisma.template.findFirst({
            where: { template_id: templateId },
            include: {
                TemplatesLanguages: {
                    where: { language: { in: languages } },
                    select: { attribute: true, value: true, language: true, language_id: true, translation_uuid: true }
                }
            }
        })

        if (!template) {
            throw NotFoundError(`No template found with id: ${templateId}`, 404)
        }

        const {
            value: nonTextConfig,
            name,
            languages: translatedLanguages,
            status,
            created_at,
            updated_at,
            archived_at,
            archived_by
        } = template

        const textEntriesByLanguage = template.TemplatesLanguages.reduce(
            (acc, { attribute, value, language, language_id, translation_uuid }) => {
                acc[language] = acc[language] || []
                acc[language].push({ attribute, value, language_id, translation_uuid })
                return acc
            },
            {}
        )

        return {
            templateId,
            name,
            status,
            created_at,
            translatedLanguages,
            updated_at,
            archived_at,
            archived_by,
            nonTextConfig,
            textEntriesByLanguage
        }
    } catch (error) {
        if (error.name === 'NotFoundError') {
            throw error
        }
        throw UnexpectedError('Error fetching template', 500, {
            message: 'Error fetching template',
            data: String(error)
        })
    }
}

/**
 * Fetches a paginated list of templates for a given organization.
 *
 * @async
 * @function getAllTemplates
 * @param {number} [page=1] - The page number for pagination (default is 1).
 * @param {number} [pageSize=10] - The number of templates to return per page (default is 10).
 * @param {('asc'|'desc')} [orderBy='desc'] - The order of the results based on the creation date (default is 'desc').
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing:
 *  - {Array<Object>} scans - The list of template objects, each containing:
 *      - {string} template_id - The unique identifier of the template.
 *      - {string} name - The name of the template.
 *      - {string} status - The status of the template.
 *      - {Date} created_at - The timestamp when the template was created.
 *      - {Date} updated_at - The timestamp when the template was last updated.
 *  - {number} total - The total number of templates for the organization.
 *  - {number} page - The current page number.
 *  - {number} page_size - The number of templates per page.
 *  - {number} total_pages - The total number of pages based on the total templates and pageSize.
 *
 * @throws {UnexpectedError} Throws an UnexpectedError if there is an issue fetching the templates.
 */
async function getAllTemplates(page = 1, pageSize = 10, archived, orderBy = 'desc', status) {
    const offset = (page - 1) * pageSize
    const condition = { ...(status !== false && { status }) }

    if (archived === 'false') {
        // Show only non-archived (active) templates
        condition.archived_at = null
    } else if (archived === 'true') {
        // Show only archived templates
        condition.archived_at = { not: null }
    }
    // if archived === 'all', show both archived and non-archived (no additional filter)
    try {
        const total = await prisma.template.count({ where: condition })
        const templates = await prisma.template.findMany({
            where: condition,
            skip: offset,
            take: pageSize,
            orderBy: { created_at: orderBy },
            select: {
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
            templates,
            total,
            page,
            page_size: pageSize,
            total_pages: Math.ceil(total / pageSize)
        }
    } catch (error) {
        console.error('Error fetching templates:', error)
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            message: 'Error fetching templates',
            data: String(error)
        })
    }
}

async function updateTemplateWithLanguages(templateId, templateData, languageRows) {
    try {
        const result = await prisma.$transaction(async (tx) => {
            // Step 1: Update template
            await tx.template.update({
                where: {
                    template_id: templateId
                },
                data: templateData
            })
            // Step 2: Bulk update existing language rows only
            if (languageRows?.length > 0) {
                await tx.$executeRaw`
                WITH updates (template_id, language, attribute, value, translation_uuid) AS (
                    VALUES ${Prisma.join(languageRows.map((r) => Prisma.sql`(
                        ${templateId}::uuid, 
                        ${r.language}::text, 
                        ${r.attribute}::"TemplateAttribute", 
                        ${r.value}::text,
                        ${r.translation_uuid ? r.translation_uuid : null}::uuid
                    )`))}
                )
                UPDATE "TemplatesLanguages" tl
                SET 
                    "value" = updates.value,
                    "translation_uuid" = COALESCE(updates.translation_uuid, tl.translation_uuid), -- only overwrite if provided
                    "updated_at" = now()
                FROM updates
                WHERE tl.template_id = updates.template_id
                    AND tl.language = updates.language
                    AND tl.attribute = updates.attribute
            `
            }
            return true
        })
        return result
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw NotFoundError(`No record found with this id: ${templateId}`, 404)
        }
        throw UnexpectedError('INTERNAL_SERVER_ERROR', 500, {
            data: String(error),
            id: templateId
        })
    }
}

async function updateTemplateArchival(templateId, archivedAt, archivedBy, prismaTransaction = '') {
    try {
        const dbClient = prismaTransaction || prisma
        const updatedTemplate = await dbClient.template.update({
            where: { template_id: templateId },
            data: {
                archived_at: archivedAt,
                archived_by: archivedBy
            },
            select: {
                template_id: true,
                archived_at: true,
                archived_by: true
            }
        })
        return updatedTemplate
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new NotFoundError(`No record found with this id: ${templateId}`, 404)
        }
        throw new UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            data: String(error),
            id: templateId
        })
    }
}

async function getTemplateWithoutLanguage(templateId) {
    try {
        const template = await prisma.template.findUnique({
            where: {
                template_id: templateId
            },
            select: {
                template_id: true,
                name: true,
                status: true,
                archived_at: true,
                archived_by: true            
            }
        })

        if (!template) {
            throw new NotFoundError(`Template not found with id: ${templateId}`, 404)
        }

        return template
    } catch (error) {
        if (error.name === 'NotFoundError') {
            throw error
        }
        throw new UnexpectedError('Error fetching template for archival', 500, {
            message: 'Error fetching template for archival',
            data: String(error)
        })
    }
}

async function deleteTemplate(templateId, prismaTransaction = null) {
    try {
        const dbClient = prismaTransaction || prisma
        await dbClient.template.delete({
            where: { template_id: templateId }
        })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new NotFoundError(`No template found with id: ${templateId}`, 404)
        }
        throw new UnexpectedError('Error deleting template', 500, {
            message: 'Error deleting template',
            data: String(error)
        })
    }
}

export {
    createTemplate,
    getTemplateById,
    getAllTemplates,
    updateTemplateWithLanguages,
    updateTemplateArchival,
    getTemplateWithoutLanguage,
    deleteTemplate
}
