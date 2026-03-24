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
import {
    uuidSchema,
    nameSchema,
    buttonStringSchema,
    descriptionStringSchema,
    bannerHeadingSchema
} from './common.validations.js'

const hexColorRegex = /^#[0-9A-Fa-f]{6}$/
const contentObjectPattern = /^[A-Za-z0-9\-.,'"()/ ]+$/
const contentObject = {
    cookieBannerNotice: Joi.string()
        .min(5)
        .max(600)
        .required()
        .pattern(contentObjectPattern)
        .message(
            'Cookie Banner Description must be 5-600 characters long and contain only letters, numbers, spaces, or - . \' " / characters'
        ),
    preferenceManagerNotice: Joi.string()
        .min(5)
        .max(800)
        .required()
        .pattern(contentObjectPattern)
        .message(
            'Preference Panel Description must be 5-800 characters long and contain only letters, numbers, spaces, or - . \' " / characters'
        )
}
const themeSchema = Joi.object({
    bannerType: Joi.string().valid('box', 'banner').required(),
    positionDesktop: Joi.string()
        .valid('bottom-right', 'bottom-left', 'top-right', 'top-left', 'top', 'bottom')
        .required(),
    positionMobile: Joi.string().valid('top', 'bottom').required(),
    buttonColor: Joi.string().pattern(hexColorRegex).required(),
    hoverButtonColor: Joi.string().pattern(hexColorRegex).required(),
    buttonTextColor: Joi.string().pattern(hexColorRegex).required(),
    hoverTextColor: Joi.string().pattern(hexColorRegex).required(),
    buttonBorderRadius: Joi.string().required(),
    buttonFontWeight: Joi.string().valid('Bold', 'Normal').required(),
    fontName: Joi.string().required(),
    headingColor: Joi.string().pattern(hexColorRegex).required(),
    linkColor: Joi.string().pattern(hexColorRegex).required(),
    dropDownHeadingColor: Joi.string().pattern(hexColorRegex).required(),
    dropDownHeadingFontWeight: Joi.string().valid('Bold', 'Normal').required(),
    dropDownContentFontSize: Joi.string().required(),
    preferenceManagerHorizontalPosition: Joi.string().valid('left', 'right', 'centre').required()
})
const contentSchema = Joi.object({
    buttonsText: Joi.object({
        acceptAll: buttonStringSchema,
        moreSettings: buttonStringSchema,
        savePreferences: buttonStringSchema,
        allowNecessary: buttonStringSchema
    }).required(),
    contentDesktop: Joi.object(contentObject).required(),
    initialNoticeHeader: bannerHeadingSchema.required(),
    preferenceNoticeHeader: bannerHeadingSchema.required(),
    cookieCategoryDescriptions: Joi.object({
        analytics: descriptionStringSchema,
        functional: descriptionStringSchema,
        marketing: descriptionStringSchema,
        necessary: descriptionStringSchema
    }).required()
})
const cookieBannerTemplateSchema = Joi.object().concat(themeSchema).concat(contentSchema)

const createTemplateSchema = Joi.object({
    template: cookieBannerTemplateSchema.required(),
    status: Joi.boolean().valid(false).optional(),
    name: nameSchema.required()
}).unknown()

const editTemplateSchema = Joi.object({
    theme_values: themeSchema.required(),
    templateId: uuidSchema,
    name: nameSchema.required()
}).unknown()

const getAllTemplatesSchema = Joi.object({
    templateId: uuidSchema,
    show: Joi.string().valid('all').optional()
}).unknown()

const templateArchivalSchema = Joi.object({
    templateId: uuidSchema
}).unknown()

export { createTemplateSchema, editTemplateSchema, getAllTemplatesSchema, templateArchivalSchema }
