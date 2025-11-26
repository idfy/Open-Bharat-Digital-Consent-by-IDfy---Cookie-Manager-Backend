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
import { uuidSchema, nameSchema } from './common.validations.js'
import { ALLOWED_BANNER_TYPES } from '../services/constants.js'

const createBannerSchema = Joi.object({
    template_id: uuidSchema,
    scan_id: uuidSchema,
    banner_name: nameSchema.optional(),
    banner_type: Joi.string()
        .valid(...ALLOWED_BANNER_TYPES)
        .optional(),
    domain_id: uuidSchema
}).unknown()

const changeBannerStatusSchema = Joi.object({
    banner_id: uuidSchema,
    domain_id: uuidSchema,
    status: Joi.string().valid('active', 'inactive').required()
}).unknown()

const getAllBannerSchema = Joi.object({
    domainId: uuidSchema
}).unknown()

const bannerArchivalSchema = Joi.object({
    bannerId: uuidSchema
}).unknown()

export { createBannerSchema, getAllBannerSchema, changeBannerStatusSchema, bannerArchivalSchema }
