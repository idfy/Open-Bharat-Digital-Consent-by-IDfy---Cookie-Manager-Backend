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

import { INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_DICT, ENGLISH_ENUM_VALUE } from '../services/constants.js'
import {
    addTemplateHandler,
    baseTemplateHandler,
    showAllTemplatesInOrg,
    showTemplateByIdPerLanguage,
    editTemplateHandler,
    archiveTemplateHandler,
    unarchiveTemplateHandler
} from '../services/templates/template.services.js'
import { getPaginationParams } from '../services/utils.services.js'
import get from 'lodash/get.js'

function baseTemplate(req, res) {
    try {
        const template = baseTemplateHandler()
        return res.status(200).json(template)
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}

async function addTemplate(req, res) {
    try {
        const userId = get(req, 'current_user.account_id')
        const name = get(req, 'body.name')
        const status = get(req, 'body.status', true)
        const templateData = get(req, 'body.template', {})
        const results = await addTemplateHandler(userId, templateData, name, status)
        return res.status(results['status_code']).json(results)
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}

async function showTemplates(req, res) {
    try {
        const archived = get(req, 'query.archived', 'false')
        const { page, pageSize, orderBy } = getPaginationParams(req)
        const show = get(req, 'query.show')
        const status = show === 'all' ? false : true
        const results = await showAllTemplatesInOrg(archived, page, pageSize, orderBy, status)
        return res.status(results['status_code']).json(results)
    } catch (error) {
        console.log('Error storing showTemplates', error)
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json({ message: INTERNAL_SERVER_ERROR })
    }
}

async function showIndividualTemplate(req, res) {
    try {
        const templateId = get(req, 'params.templateId')
        const language = get(req, 'query.language', ENGLISH_ENUM_VALUE)
        const results = await showTemplateByIdPerLanguage(templateId, language)
        return res.status(results['status_code']).json(results)
    } catch (error) {
        console.log('Error storing showIndividualTemplate', error)
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}

async function editTemplate(req, res) {
    try {
        const userId = get(req, 'current_user.account_id')
        const templateId = get(req, 'params.templateId')
        const name = get(req, 'body.name')
        const themeValues = get(req, 'body.theme_values', {})
        const editedText = get(req, 'body.languages', {})
        const status = get(req, 'body.status', true)
        const results = await editTemplateHandler(userId, templateId, themeValues, editedText, name, status)
        return res.status(results['status_code']).json(results)
    } catch (error) {
        console.log('Error storing editTemplate', error)
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}

async function archiveTemplate(req, res) {
    try {
        const templateId = get(req, 'params.templateId')
        const userId = get(req, 'current_user.account_id')

        const results = await archiveTemplateHandler(templateId, userId)
        return res.status(results['status_code']).json(results)
    } catch (error) {
        console.error('Error in archiveTemplate', error)
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}

async function unarchiveTemplate(req, res) {
    try {
        const templateId = get(req, 'params.templateId')
        const userId = get(req, 'current_user.account_id')

        const results = await unarchiveTemplateHandler(templateId, userId)
        return res.status(results['status_code']).json(results)
    } catch (error) {
        console.error('Error in unarchiveTemplate', error)
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}

export {
    addTemplate,
    showTemplates,
    showIndividualTemplate,
    editTemplate,
    baseTemplate,
    archiveTemplate,
    unarchiveTemplate
}
