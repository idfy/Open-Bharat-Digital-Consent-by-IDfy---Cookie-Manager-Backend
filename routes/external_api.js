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

import express from 'express'
import { externalPostRoutesGenericInstrumentation } from '../middlewares/routing_log.middleware.js'
import { submitConsent, userClickEvents } from '../controllers/external.controller.js'
import validateSchemaExternalPostCall from '../middlewares/external_post_calls.middleware.js'
import { createConsentSchema, bannerClickEventsSchema } from '../validations/external.validations.js'

const externalAPIRouter = express.Router()
externalAPIRouter.post(
    '/consent/:bannerId',
    externalPostRoutesGenericInstrumentation,
    validateSchemaExternalPostCall(createConsentSchema),
    submitConsent
)

externalAPIRouter.post(
    '/user-interaction/events/:bannerId',
    externalPostRoutesGenericInstrumentation,
    validateSchemaExternalPostCall(bannerClickEventsSchema),
    userClickEvents
)

export default externalAPIRouter
