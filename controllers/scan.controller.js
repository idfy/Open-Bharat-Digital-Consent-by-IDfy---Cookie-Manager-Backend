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

import { INTERNAL_SERVER_ERROR_DICT, ENGLISH_ENUM_VALUE } from '../services/constants.js'
import { initiateScanHandler } from '../services/scraper/scraper.services.js'
import { getPaginationParams } from '../services/utils.services.js'
import {
    showAllScansInDomain,
    showScanById,
    archiveScanHandler,
    unarchiveScanHandler
} from '../services/scan/scan.services.js'
import get from 'lodash/get.js'

async function initiateScan(req, res) {
    try {
        const domainId = get(req, 'body.domain_id')
        const scanName = get(req, 'body.name', 'Auto Generated')
        const userId = get(req, 'current_user.account_id')
        const results = await initiateScanHandler(domainId, scanName, userId)
        return res.status(results['status_code']).json(results)
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}

async function showScans(req, res) {
    try {
        const domainId = get(req, 'params.domainId')
        const archived = get(req, 'query.archived', 'false')
        const status = get(req, 'query.status', '')
        const { page, pageSize, orderBy } = getPaginationParams(req)
        const results = await showAllScansInDomain(domainId, archived, page, pageSize, orderBy, status)
        return res.status(results['status_code']).json(results)
    } catch (error) {
        console.error('Error in showScans', error)
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}

async function showIndividualScan(req, res) {
    try {
        // const domainId =  get(req, 'query.domain_id')
        const scanId = get(req, 'params.scanId')
        const language = get(req, 'query.languages', [ENGLISH_ENUM_VALUE])
        const results = await showScanById(scanId, language)
        return res.status(results['status_code']).json(results)
    } catch (error) {
        console.log('Error storing showDomains', error)
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}

async function archiveScan(req, res) {
    try {
        const scanId = get(req, 'params.scanId')
        const domainId = get(req, 'body.domainId')
        const userId = get(req, 'current_user.account_id')

        const results = await archiveScanHandler(scanId, domainId, userId)
        return res.status(results['status_code']).json(results)
    } catch (error) {
        console.error('Error in archiveScan', error)
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}

async function unarchiveScan(req, res) {
    try {
        const scanId = get(req, 'params.scanId')
        const domainId = get(req, 'body.domainId')
        const userId = get(req, 'current_user.account_id')
        const results = await unarchiveScanHandler(scanId, domainId, userId)
        return res.status(results['status_code']).json(results)
    } catch (error) {
        console.error('Error in unarchiveScan', error)
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}

export { initiateScan, showScans, showIndividualScan, archiveScan, unarchiveScan }
