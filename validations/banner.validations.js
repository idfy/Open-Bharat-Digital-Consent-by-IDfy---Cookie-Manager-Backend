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
