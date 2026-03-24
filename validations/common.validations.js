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
const allowedSubmissionTypes = ['all', 'necessary', 'preference']
const allowedConsentCategory = [
    'NECESSARY',
    'FUNCTIONAL',
    'ANALYTICS',
    'MARKETING'
    // 'OTHER'
]
const allowedUserEvents = ['BannerView', 'PreferenceCenter', 'CustomizeCookiesView']
const cookieCategory = Joi.string().valid(...allowedConsentCategory)
const uuidSchema = Joi.string().guid({ version: 'uuidv4' }).required().messages({
    'string.guid': 'Invalid ID format'
})
const sourceTypeSchema = Joi.string().valid('embed', 'iframe', 'img', 'script').required().messages({
    'any.only': 'sourceType must be one of: embed, iframe, img, script',
    'string.base': 'sourceType must be a string',
    'string.empty': 'sourceType is required'
})

const nameSchema = Joi.string()
    .trim()
    .min(3)
    .max(50)
    .pattern(/^[A-Za-z0-9\- ]+$/)
    .messages({
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name must be at most 50 characters long',
        'string.empty': 'Name is required',
        'string.pattern.base': 'Name can only contain letters, numbers, spaces, or - characters'
    })

const descriptionStringSchema = Joi.string()
    .min(10)
    .max(500)
    .pattern(/^[A-Za-z0-9\-.,()'"/ ]+$/)
    .messages({
        'string.min': 'Description must be at least 10 characters long',
        'string.max': 'Description must be at most 500 characters long',
        'string.empty': 'Description is required',
        'string.pattern.base': 'Description can only contain letters, numbers, spaces, or - . , \' " / () characters'
    })

const buttonStringSchema = Joi.string()
    .trim()
    .min(3)
    .max(25)
    .pattern(/^[A-Za-z ]+$/)
    .required()
    .messages({
        'string.empty': 'Button text is required',
        'string.min': 'Button text must be at least 3 characters long',
        'string.max': 'Button text must be at most 25 characters long',
        'string.pattern.base': 'Button text can only contain letters and spaces'
    })

const bannerHeadingSchema = Joi.string()
    .trim()
    .min(3)
    .max(50)
    .pattern(/^[A-Za-z0-9\-/() ]+$/)
    .messages({
        'string.min': 'Banner Heading must be at least 3 characters long',
        'string.max': 'Banner Heading must be at most 50 characters long',
        'string.empty': 'Banner Heading is required',
        'string.pattern.base': 'Banner Heading can only contain letters, numbers, spaces, or - / () characters'
    })

const languageType = Joi.string().valid('en', 'hi')
const externalSubmissionType = Joi.string().valid(...allowedSubmissionTypes)
const externalUserEvent = Joi.string().valid(...allowedUserEvents)

const userPreferenceSchema = Joi.object({
    // eslint-disable-next-line node/no-unsupported-features/es-builtins
    ...Object.fromEntries(
        allowedConsentCategory.map((key) => [
            key,
            key === 'NECESSARY'
                ? Joi.boolean().valid(true).required() // NECESSARY must be true
                : Joi.boolean().required()
        ])
    ),
    'update': Joi.boolean().optional()
}).unknown(false)

export {
    cookieCategory,
    uuidSchema,
    languageType,
    externalSubmissionType,
    userPreferenceSchema,
    externalUserEvent,
    descriptionStringSchema,
    nameSchema,
    buttonStringSchema,
    bannerHeadingSchema,
    sourceTypeSchema
}
