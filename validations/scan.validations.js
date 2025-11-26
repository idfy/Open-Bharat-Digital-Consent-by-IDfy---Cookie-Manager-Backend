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
import { uuidSchema, languageType, nameSchema } from './common.validations.js'

const initiateScanSchema = Joi.object({
    name: nameSchema.optional(),
    domain_id: uuidSchema
}).unknown()

const showScansSchema = Joi.object({
    domainId: uuidSchema
}).unknown()

const showIndividualScanSchema = Joi.object({
    scanId: uuidSchema,
    languages: Joi.array().items(languageType).min(1).optional() // Optional, but if present, must have at least one valid language
}).unknown()

const scanFailureSchema = Joi.object({
    request_id: uuidSchema
}).unknown()

const scanArchivalSchema = Joi.object({
    scanId: uuidSchema,
    domainId: uuidSchema
}).unknown()

export { initiateScanSchema, showScansSchema, showIndividualScanSchema, scanFailureSchema, scanArchivalSchema }
