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

import { createScan } from '../db/scan.services.js'
import { getDomainById } from '../db/domain.services.js'
import { logger } from '../logger/instrumentation.services.js'
import { handleServiceError } from '../utils.services.js'

async function initiateScanHandler(domainId, scanName, userId) {
    const result = {
        message: 'Scan Created',
        status_code: 200
    }
    const logDict = {
        service: 'Scraper',
        reference_id: userId,
        reference_type: 'userID',
        event_name: 'initiateScan',
        details: { domainId }
    }
    logger('info', 'Invoked', logDict)
    try {
        await getDomainById(domainId)
        const dbData = {
            domain_id: domainId,
            name: scanName,
            status: 'completed'
        }
        await createScan(dbData)
        logger('info', 'Success', logDict)
        return result
    } catch (error) {
        logger('error', 'Exception', logDict)
        return handleServiceError(result, error, {}, 'initiateScanHandler')
    }
}

export { initiateScanHandler }
