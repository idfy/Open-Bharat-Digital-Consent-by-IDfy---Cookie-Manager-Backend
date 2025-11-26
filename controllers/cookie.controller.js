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

import { INTERNAL_SERVER_ERROR_DICT } from '../services/constants.js'
import { updateCookiesCategoryAndDescription } from '../services/db/cookie/common.services.js'
import get from 'lodash/get.js'
import { updateAllCookieTables } from '../services/cookie/cookie_update.js'
import { addCookiesToDB, addCookiesViaCSV } from '../services/cookie/add_cookies.js'
import { deleteCookie } from '../services/db/cookie/cookie.services.js'
async function updateCookiesHandler(req, res) {
    try {
        const domainId = get(req, 'body.domain_id')
        const descriptionUpdates = get(req, 'body.descriptions')
        const categoryUpdates = get(req, 'body.categories')
        const userId = get(req, 'current_user.account_id')
        const results = await updateCookiesCategoryAndDescription(domainId, categoryUpdates, descriptionUpdates, userId)
        return res.status(results['status_code']).json(results)
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}
async function addCookieHandler(req, res) {
    try {
        const scanId = get(req, 'params.scanId')
        const domainId = get(req, 'body.domain_id')
        const cookies = get(req, 'body.cookies', [])
        const userId = get(req, 'current_user.account_id')
        const results = await addCookiesToDB(cookies, scanId, domainId, userId)

        return res.status(results['status_code']).json(results)
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}
async function addCookiesCSVHandler(req, res) {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({ message: 'No file uploaded' })
        }
        const domainId = get(req, 'body.domain_id')
        const scanId = get(req, 'params.scanId')
        const userId = get(req, 'current_user.account_id')
        const results = await addCookiesViaCSV(req.file.buffer, scanId, domainId, userId)

        return res.status(results['status_code']).json(results)
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}
async function updateManualCookieHandler(req, res) {
    try {
        const scanId = get(req, 'params.scanId')
        const domainId = get(req, 'body.domain_id')
        const cookieMasterId = get(req, 'body.cookie_master_id')
        const languageId = get(req, 'body.language_id')
        const category = get(req, 'body.category')
        const name = get(req, 'body.name')
        const cookieId = get(req, 'body.cookie_id')
        const description = get(req, 'body.description')
        const meta_data = get(req, 'body.meta_data')
        const domain = get(req, 'body.domain')
        const userId = get(req, 'current_user.account_id')
        const results = await updateAllCookieTables({
            scanId,
            domainId,
            cookieMasterId,
            category,
            name,
            domain,
            description,
            cookieId,
            languageId,
            meta_data,
            userId
        })

        return res.status(results['status_code']).json(results)
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}
async function deleteCookieHandler(req, res) {
    try {
        const cookieId = get(req, 'body.cookie_id')
        const domainId = get(req, 'body.domain_id')
        const userId = get(req, 'current_user.account_id')
        const result = await deleteCookie(cookieId, domainId, userId)

        return res.status(result['status_code']).json(result)
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}
export { updateCookiesHandler, addCookieHandler, addCookiesCSVHandler, deleteCookieHandler, updateManualCookieHandler }
