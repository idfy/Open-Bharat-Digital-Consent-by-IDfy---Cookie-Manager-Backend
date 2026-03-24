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

import express from 'express'
import { addDomain, showDomains } from '../controllers/domain.controller.js'
import validateSchemaPostCall from '../middlewares/post_routes.middleware.js'
import { createDomainSchema } from '../validations/domain.validations.js'
import checkScanAccess from '../middlewares/scan_access_middleware.js'

const domainRouter = express.Router()

domainRouter.post('/domain/add', validateSchemaPostCall(createDomainSchema), checkScanAccess, addDomain)

domainRouter.get('/domains', checkScanAccess, showDomains)

export default domainRouter
