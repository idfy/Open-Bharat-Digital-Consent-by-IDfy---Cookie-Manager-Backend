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
import { translateTemplate } from '../controllers/translation.controller.js'
const translateRouter = express.Router()
translateRouter.post('/template', translateTemplate)

export default translateRouter
