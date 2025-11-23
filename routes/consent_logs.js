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
