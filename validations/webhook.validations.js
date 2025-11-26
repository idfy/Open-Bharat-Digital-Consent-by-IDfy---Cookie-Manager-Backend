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

import Joi from 'joi'
import { uuidSchema } from './common.validations.js'

const scraperCallbackSchema = Joi.object({
    template_id: uuidSchema,
    scan_id: uuidSchema,
    domain_id: uuidSchema
}).unknown()

export { scraperCallbackSchema }
