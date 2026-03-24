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

import { INTERNAL_SERVER_ERROR_DICT } from '../services/constants.js'

import { getPaginationParams } from '../services/utils.services.js'
import { showAllConsentLogs } from '../services/consent_logs/consent_log.services.js'

import get from 'lodash/get.js'

async function showConsentLogs(req, res) {
    try {
        const bannerIds = get(req, 'query.banner_id', [])
        const domainId = get(req, 'query.domain_id', '')
        const paginationData = getPaginationParams(req)
        const results = await showAllConsentLogs(paginationData, bannerIds, domainId)
        return res.status(results['status_code']).json(results)
    } catch (error) {
        console.log('Error storing showConsentLogs', error)
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}

export { showConsentLogs }
