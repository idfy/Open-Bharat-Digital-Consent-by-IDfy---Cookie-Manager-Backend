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

import prisma from '../db/config.js'
import { updateCookieMaster } from '../db/cookie/cookie_master.services.js'
import { updateManualCookieMasterLanguage } from '../db/cookie/cookie_master_language.services.js'
import { updateCookie } from '../db/cookie/cookie.services.js'
import { expiryFormatting } from '../utils/cookie_utils.services.js'
import { getDomainById } from '../db/domain.services.js'
import { handleServiceError } from '../utils.services.js'
import { logger } from '../logger/instrumentation.services.js'
/**
 * Updates cookie master, language, and metadata records in a single transaction.
 * Ensures all related cookie tables stay consistent — if any update fails,
 * the entire transaction is rolled back.
 *
 * @async
 * @function updateAllCookieTables
 * @param {Object} cookie
 * @param {string} cookie.domainId
 * @param {string} cookie.cookieMasterId
 * @param {string} cookie.category
 * @param {string} cookie.name
 * @param {string} cookie.domain
 * @param {string} cookie.description
 * @param {string} cookie.cookieId
 * @param {Object} cookie.meta_data
 * @param {Object} cookie.meta_data.duration  - session flag + expiry (years/months/days)
 * @param {string[]} cookie.meta_data.sources - list of source strings
 * @param {string[]} cookie.meta_data.source_type - type of source
 * @returns {Promise<void>}
 * @throws {Error} If any update inside the transaction fails.
 */
async function updateAllCookieTables(cookie) {
    const results = { status_code: 200, message: 'Success' }
    const {
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
    } = cookie

    const logDict = {
        service: 'CookiesManualUpdate',
        reference_id: userId,
        reference_type: 'UserID',
        event_name: 'CookiesManualUpdate',
        details: {
            user_id: userId,
            domain_id: domainId,
            cookie
        }
    }
    try {
        logger('info', 'Invoked', logDict)
        await getDomainById(domainId)

        const meta_data_expiry = expiryFormatting(meta_data.duration)
        const data = {
            meta_data: {
                expires_at: meta_data_expiry.expires_at,
                duration: meta_data_expiry.duration,
                requestChain: { sourceUrls: meta_data.sources, type: meta_data.source_type }
            }
        }
        const cookieMasterData = cookieUpdatePreChecks(name, category, description, domain, 'CookieMaster')
        const cookieMasterLanguageData = cookieUpdatePreChecks(
            name,
            category,
            description,
            domain,
            'CookieMasterLanguage'
        )
        await prisma.$transaction(async (tx) => {
            await updateCookieMaster(domainId, cookieMasterId, cookieMasterData, tx)
            await updateManualCookieMasterLanguage(cookieMasterId, domainId, languageId, cookieMasterLanguageData, tx)
            await updateCookie(cookieId, scanId, data, tx)
        })
        logger('info', 'Success', logDict, true)
        return results
    } catch (error) {
        logger('warn', 'Failed', logDict, true)
        console.error('Error in updateAllCookieTables:', error)
        return handleServiceError(results, error, {}, updateAllCookieTables)
    }
}
function cookieUpdatePreChecks(name, category, description, cookie_domain, type) {
    const dataToUpdate = {}
    let fields = {}
    if (type === 'CookieMaster') {
        fields = { category, name, cookie_domain }
    } else if (type === 'CookieMasterLanguage') {
        fields = { name, description }
    } else {
        fields
    }

    for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined && value !== null) {
            dataToUpdate[key] = value
        }
    }
    return dataToUpdate
}

export { updateAllCookieTables }
