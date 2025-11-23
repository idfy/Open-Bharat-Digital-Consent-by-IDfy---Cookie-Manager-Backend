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
