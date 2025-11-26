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

import { parseUrl, handleServiceError } from '../utils.services.js'
import { createDomain, getAllDomains } from '../db/domain.services.js'
import { logger } from '../logger/instrumentation.services.js'
import { v4 as uuidv4 } from 'uuid'

async function addDomainHandler(url, userId) {
    const result = {
        message: 'Domain Added',
        status_code: 201
    }
    const domainId = uuidv4()
    const logDict = {
        service: 'DomainCreation',
        reference_id: domainId,
        reference_type: 'DomainID',
        event_name: 'DomainCreation',
        details: {
            user_id: userId,
            url
        }
    }
    logger('info', 'Invoked', logDict)
    try {
        const urlDetails = parseUrl(url)
        const baseUrl = urlDetails['base_url']
        const config = {
            start_url: url
        }
        const dbData = {
            domain_id: domainId,
            url: baseUrl,
            config
        }
        await createDomain(dbData)
        logger('info', 'Success', logDict, true)
        return result
    } catch (error) {
        return handleServiceError(result, error, logDict, 'addDomainHandler')
    }
}

async function showAllDomainsInOrg(page, pageSize, orderBy) {
    let result = {
        status_code: 200,
        domains: []
    }
    try {
        const dbDetails = await getAllDomains(page, pageSize, orderBy)
        result = { ...result, ...dbDetails }
        return result
    } catch (error) {
        const results = handleServiceError(result, error, {}, 'addDomainHandler')
        results['domains'] = []
        return results
    }
}

export { addDomainHandler, showAllDomainsInOrg }
