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

import { handleServiceError } from '../utils.services.js'
import {
    createTemplate,
    getAllTemplates,
    getTemplateById,
    updateTemplateWithLanguages,
    updateTemplateArchival,
    deleteTemplate,
    getTemplateWithoutLanguage
} from '../db/template.services.js'
import { getCountOfBannersUsingTemplate, getActiveBanners } from '../db/banner.services.js'
import { DEFAULT_TEMPLATE } from './default_template.js'
import { ENGLISH_ENUM_VALUE } from '../constants.js'
import { logger } from '../logger/instrumentation.services.js'
import { extractTemplateConfig, templateTextDictToUIConfig, buildTemplateLanguageRows } from './utils.js'
import { v4 as uuidv4 } from 'uuid'
import { UnexpectedError } from '../custom_error.js'

async function addTemplateHandler(userId, templateData, name, status, languages = [ENGLISH_ENUM_VALUE]) {
    const templateId = uuidv4()

    const result = {
        message: 'Template Created',
        status_code: 201,
        template_id: templateId
    }
    const logDict = {
        service: 'TemplateCreation',
        reference_id: userId,
        reference_type: 'UserID',
        event_name: 'TemplateCreation',
        details: {
            user_id: userId,
            template_id: templateId,
            name,
            status,
            template_data: templateData
        }
    }
    try {
        logger('info', 'Invoked', logDict)
        const { nonTextConfig, textEntries } = extractTemplateConfig(templateData, ENGLISH_ENUM_VALUE)
        const dbData = {
            templateId,
            nonTextConfig,
            languages,
            name,
            status,
            textEntries
        }
        await createTemplate(dbData)
        logger('info', 'Success', logDict, true)
        return result
    } catch (error) {
        logger('warn', 'Failed', logDict, true)
        console.log(error)
        return handleServiceError(result, error, {}, 'addTemplateHandler')
    }
}

async function showAllTemplatesInOrg(archived, page, pageSize, orderBy, status) {
    let result = {
        message: 'Success',
        status_code: 200,
        templates: []
    }
    try {
        const dbDetails = await getAllTemplates(page, pageSize, archived, orderBy, status)
        result = { ...result, ...dbDetails }
        return result
    } catch (error) {
        const results = handleServiceError(result, error, {}, 'addTemplateHandler')
        results['templates'] = []
        return results
    }
}

async function showTemplateByIdPerLanguage(templateId, language) {
    const result = {
        message: 'Success',
        status_code: 200,
        data: {}
    }
    try {
        const { name, status, created_at, translatedLanguages, updated_at, nonTextConfig, textEntriesByLanguage } =
            await getTemplateById(templateId, [language])
        const template = { ...nonTextConfig, ...templateTextDictToUIConfig(textEntriesByLanguage[language]) }
        result['data'] = {
            name,
            template_id: templateId,
            status,
            created_at,
            updated_at,
            value: template,
            languages: translatedLanguages
        }
        return result
    } catch (error) {
        const results = handleServiceError(result, error, {}, 'showAllScansInDomain')
        return results
    }
}

// eslint-disable-next-line max-params
async function editTemplateHandler(userId, templateId, themeData, editedText, name, status) {
    const result = {
        message: 'Template Edited',
        status_code: 200
    }
    const logDict = {
        service: 'TemplateEdit',
        reference_id: userId,
        reference_type: 'UserID',
        event_name: 'TemplateEdit',
        details: {
            user_id: userId,
            template_id: templateId,
            name,
            template_data: themeData,
            edited_text: editedText,
            status
        }
    }
    try {
        logger('info', 'Invoked', logDict)
        const templateDBData = {
            value: themeData,
            status,
            name
        }
        await getCountOfBannersUsingTemplate(templateId)
        const languageRows = buildTemplateLanguageRows(templateId, editedText)
        await updateTemplateWithLanguages(templateId, templateDBData, languageRows)
        logger('info', 'Success', logDict, true)
        return result
    } catch (error) {
        console.log(error)
        logger('warn', 'Failed', logDict, true)
        return handleServiceError(result, error, {}, 'editTemplateHandler')
    }
}

function addMissingValues(template = {}) {
    const result = { ...template }
    Object.keys(DEFAULT_TEMPLATE).forEach((key) => {
        if (!(key in result)) {
            result[key] = DEFAULT_TEMPLATE[key]
        }
    })
    return result
}

function baseTemplateHandler() {
    const template = { ...DEFAULT_TEMPLATE }
    return {
        data: {
            value: template,
            languages: [ENGLISH_ENUM_VALUE]
        }
    }
}

async function deleteDraftTemplate(templateId, adminUserId) {
    try {
        const template = await getTemplateWithoutLanguage(templateId)

        await deleteTemplate(templateId)

        const logDict = {
            service: 'TemplateHardDelete',
            reference_id: templateId,
            reference_type: 'TemplateID',
            event_name: 'Deleted',
            details: {
                deleted_by: adminUserId,
                deleted_at: new Date(),
                template_name: template.name
            }
        }

        logger('info', 'Draft template hard deleted successfully', logDict)

        return {
            message: 'Template deleted permanently',
            status_code: 200
        }
    } catch (error) {
        console.error('Error in deleteDraftTemplate:', error)
        if (error.name === 'UnexpectedError' || error.name === 'NotFoundError') {
            throw error
        }
        throw new UnexpectedError('Failed to delete draft template', 500)
    }
}

async function archiveTemplateHandler(templateId, adminUserId) {
    try {
        const template = await getTemplateWithoutLanguage(templateId)

        if (template.archived_at) {
            return {
                message: 'Template is already archived',
                status_code: 200
            }
        }

        // Check template status - if it's a draft template, hard delete it
        if (!template.status) {
            return await deleteDraftTemplate(templateId, adminUserId)
        }

        // Check if there are any active banners using this template
        const activeBanners = await getActiveBanners({ template_id: templateId })
        if (activeBanners.length > 0) {
            return {
                message: 'Cannot delete template. There are active banners using this template.',
                status_code: 409,
                data: {
                    active_banners: activeBanners.map((banner) => ({
                        banner_id: banner.banner_id,
                        banner_name: banner.name,
                        domain_id: banner.domain_id
                    }))
                }
            }
        }

        // For non-draft templates, soft delete (archive)
        await updateTemplateArchival(templateId, new Date(), adminUserId)

        const logDict = {
            service: 'TemplateArchival',
            reference_id: templateId,
            reference_type: 'TemplateID',
            event_name: 'Archived',
            details: {
                archived_by: adminUserId,
                archived_at: new Date(),
                template_name: template.name
            }
        }

        logger('info', 'Template archived successfully', logDict)

        return {
            message: 'Template deleted successfully',
            status_code: 200
        }
    } catch (error) {
        console.error('Error in archiveTemplateHandler:', error)
        if (error.name === 'UnexpectedError' || error.name === 'NotFoundError') {
            throw error
        }
        throw new UnexpectedError('Failed to archive template', 500)
    }
}

async function unarchiveTemplateHandler(templateId, adminUserId) {
    try {
        const template = await getTemplateWithoutLanguage(templateId)

        if (!template.archived_at) {
            return {
                message: 'Template is already active',
                status_code: 200
            }
        }

        await updateTemplateArchival(templateId, null, null)

        const logDict = {
            service: 'TemplateUnarchival',
            reference_id: templateId,
            reference_type: 'TemplateID',
            event_name: 'Unarchived',
            details: {
                unarchived_by: adminUserId,
                unarchived_at: new Date(),
                template_name: template.name
            }
        }

        logger('info', 'Template unarchived successfully', logDict)

        return {
            message: 'Template restored successfully',
            status_code: 200
        }
    } catch (error) {
        console.error('Error in unarchiveTemplateHandler:', error)
        if (error.name === 'UnexpectedError' || error.name === 'NotFoundError') {
            throw error
        }
        throw new UnexpectedError('Failed to unarchive template', 500)
    }
}

export {
    addTemplateHandler,
    showAllTemplatesInOrg,
    showTemplateByIdPerLanguage,
    editTemplateHandler,
    addMissingValues,
    baseTemplateHandler,
    archiveTemplateHandler,
    unarchiveTemplateHandler
}
