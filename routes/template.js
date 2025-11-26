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

import express from 'express'

import {
    addTemplate,
    baseTemplate,
    showTemplates,
    showIndividualTemplate,
    editTemplate,
    archiveTemplate,
    unarchiveTemplate
} from '../controllers/template.controller.js'
import validateSchemaPostCall from '../middlewares/post_routes.middleware.js'
import validateSchemaGetCall from '../middlewares/get_routes.middleware.js'
import checkArchivalAccess from '../middlewares/archival_access.middleware.js'
import {
    createTemplateSchema,
    editTemplateSchema,
    getAllTemplatesSchema,
    templateArchivalSchema
} from '../validations/template.validations.js'
import checkEditorAccess from '../middlewares/editor_access.middleware.js'

const templateRouter = express.Router()

templateRouter.get('/template/base',checkEditorAccess, baseTemplate)
templateRouter.post(
    '/template/add',
    validateSchemaPostCall(createTemplateSchema),
    checkEditorAccess,
    addTemplate
)
templateRouter.get('/templates', checkEditorAccess, showTemplates)

templateRouter.get(
    '/template/:templateId',
    validateSchemaGetCall(getAllTemplatesSchema),
    checkEditorAccess,
    showIndividualTemplate
)

templateRouter.put(
    '/template/update/:templateId',
    validateSchemaPostCall(editTemplateSchema),
    checkEditorAccess,
    editTemplate
)

templateRouter.patch(
    '/template/archive/:templateId',
    checkArchivalAccess,
    validateSchemaPostCall(templateArchivalSchema),
    archiveTemplate
)
templateRouter.patch(
    '/template/unarchive/:templateId',
    checkArchivalAccess,
    validateSchemaPostCall(templateArchivalSchema),
    unarchiveTemplate
)

export default templateRouter
