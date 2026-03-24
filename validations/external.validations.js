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

import Joi from 'joi'
import { uuidSchema, externalSubmissionType, externalUserEvent, userPreferenceSchema } from './common.validations.js'

const createConsentSchema = Joi.object({
    bannerId: uuidSchema,
    data_principal_id: uuidSchema,
    submission_type: externalSubmissionType.optional(),
    sid: uuidSchema,
    user_preference: userPreferenceSchema.required()
}).unknown()

const bannerClickEventsSchema = Joi.object({
    bannerId: uuidSchema,
    data_principal_id: uuidSchema,
    user_event: externalUserEvent.required(),
    sid: uuidSchema
}).unknown()
export { createConsentSchema, bannerClickEventsSchema }
