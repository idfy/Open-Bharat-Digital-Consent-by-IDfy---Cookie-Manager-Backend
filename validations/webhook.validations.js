import Joi from 'joi'
import { uuidSchema } from './common.validations.js'

const scraperCallbackSchema = Joi.object({
    template_id: uuidSchema,
    scan_id: uuidSchema,
    domain_id: uuidSchema
}).unknown()

export { scraperCallbackSchema }
