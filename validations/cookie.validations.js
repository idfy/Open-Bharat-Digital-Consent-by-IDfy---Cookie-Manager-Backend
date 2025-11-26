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
import {
    cookieCategory,
    uuidSchema,
    descriptionStringSchema,
    nameSchema,
    sourceTypeSchema
} from './common.validations.js'
const cookieDomainRegex = /^\.?[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/
const descriptionSchema = Joi.object({
    language_id: uuidSchema,
    description: descriptionStringSchema
})

const categorySchema = Joi.object({
    cookie_master_id: uuidSchema,
    category: cookieCategory.required()
})
const MAX_VALUES_ACCEPTED = 20
const updateCookiesSchema = Joi.object({
    descriptions: Joi.array()
        .items(descriptionSchema)
        .max(MAX_VALUES_ACCEPTED)
        .unique('language_id')
        .sparse(false)
        .required(),
    categories: Joi.array()
        .items(categorySchema)
        .max(MAX_VALUES_ACCEPTED)
        .unique('cookie_master_id')
        .sparse(false)
        .required(),
    scanId: uuidSchema,
    domain_id: uuidSchema
}).unknown()

const addCookieSchema = Joi.object({
    cookie_name: nameSchema.required(),
    description: descriptionStringSchema.required(),
    category: cookieCategory.required(),
    cookie_domain: Joi.string().pattern(cookieDomainRegex).required(),
    duration: Joi.object({
        is_session: Joi.boolean().required(),
        expiry: Joi.object({
            years: Joi.number().min(0).required(),
            months: Joi.number().min(0).required(),
            days: Joi.number().min(0).required()
        })
    }).required(),
    sources: Joi.array()
        .items(
            Joi.string()
                .uri({ scheme: ['http', 'https'] })
                .messages({
                    'string.uri': 'Each source must be a valid URL (starting with http:// or https://)'
                })
        )
        .min(1)
        .max(5)
        .required(),
    source_type: sourceTypeSchema.required()
}).unknown()

const addManualCookiesSchema = Joi.object({
    cookies: Joi.array().items(addCookieSchema).min(1).required(),
    scanId: uuidSchema,
    domain_id: uuidSchema
})
const deleteCookieSchema = Joi.object({
    cookie_id: uuidSchema,
    domain_id: uuidSchema
}).unknown()

const updateManualCookieSchema = Joi.object({
    name: nameSchema.required(),
    description: descriptionStringSchema.required(),
    category: cookieCategory.required(),
    domain: Joi.string().pattern(cookieDomainRegex).required(),
    meta_data: Joi.object({
        duration: Joi.object({
            is_session: Joi.boolean().required(),
            expiry: Joi.object({
                years: Joi.number().min(0).required(),
                months: Joi.number().min(0).required(),
                days: Joi.number().min(0).required()
            })
        }).required(),
        sources: Joi.array()
            .items(
                Joi.string()
                    .uri({ scheme: ['http', 'https'] })
                    .messages({ 'string.uri': 'Each source must be a valid URL (starting with http:// or https://)' })
            )
            .min(1)
            .max(5)
            .required(),
        source_type: sourceTypeSchema.required()
    }).required(),
    domain_id: uuidSchema,
    scanId: uuidSchema,
    language_id: uuidSchema,
    cookie_id: uuidSchema,
    cookie_master_id: uuidSchema
}).unknown()

const uploadCSVSchema = Joi.object({
    scanId: uuidSchema,
    domain_id: uuidSchema
})

export {
    updateCookiesSchema,
    addCookieSchema,
    addManualCookiesSchema,
    updateManualCookieSchema,
    deleteCookieSchema,
    uploadCSVSchema
}
