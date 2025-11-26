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
import { showConsentLogs } from '../controllers/consent_logs.controller.js'
import validateSchemaGetCall from '../middlewares/get_routes.middleware.js'
import { showConsentLogsSchema } from '../validations/consent_log.validations.js'
import checkEditorAccess from '../middlewares/editor_access.middleware.js'

const consentLogRouter = express.Router()

consentLogRouter.get(
    '/consent-logs',
    validateSchemaGetCall(showConsentLogsSchema),
    checkEditorAccess,
    showConsentLogs
)

export default consentLogRouter
