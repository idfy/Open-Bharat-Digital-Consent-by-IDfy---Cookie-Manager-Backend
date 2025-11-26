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

import express from 'express'
import { externalGetRoutesGenericInstrumentation } from '../middlewares/routing_log.middleware.js'
import { sendJSFile } from '../controllers/external.controller.js'
const externalAssetsRouter = express.Router()
externalAssetsRouter.get('/:bannerId', externalGetRoutesGenericInstrumentation, sendJSFile)
export default externalAssetsRouter
