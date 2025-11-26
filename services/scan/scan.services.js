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

import { getAllScans, getScanById, updateScanArchival } from '../db/scan.services.js'
import { getActiveBanners } from '../db/banner.services.js'
import { handleServiceError } from '../utils.services.js'
import { getCookieDetailsByScanId } from '../db/cookie/common.services.js'
import { ENGLISH_ENUM_VALUE } from '../constants.js'
import { UnexpectedError } from '../custom_error.js'
import { logger } from '../logger/instrumentation.services.js'

async function showAllScansInDomain(domainId, archived, page, pageSize, orderBy, status) {
    let result = {
        message: 'Success',
        status_code: 200,
        scans: []
    }
    try {
        const dbDetails = await getAllScans(domainId, page, pageSize, status, archived, orderBy)
        result = { ...result, ...dbDetails }
        return result
    } catch (error) {
        const results = handleServiceError(result, error, {}, 'showAllScansInDomain')
        results['scans'] = []
        return results
    }
}

async function showScanById(scanId, language = [ENGLISH_ENUM_VALUE]) {
    const result = {
        message: 'Success',
        status_code: 200,
        data: {}
    }
    try {
        const dbDetails = await getCookieDetailsByScanId(scanId, language, true)
        result['data'] = dbDetails
        return result
    } catch (error) {
        console.log(error)
        const results = handleServiceError(result, error, {}, 'showAllScansInDomain')
        return results
    }
}
async function archiveScanHandler(scanId, domainId, adminUserId) {
    try {
        const scan = await getScanById(scanId, domainId)

        if (scan.archived_at) {
            return {
                message: 'Scan is already archived',
                status_code: 200
            }
        }

        // Check if there are any active banners using this scan
        const activeBanners = await getActiveBanners({ scan_id: scanId })
        if (activeBanners.length > 0) {
            return {
                message: 'Cannot delete scan. There are active banners using this scan.',
                status_code: 409,
                data: {
                    active_banners: activeBanners.map((banner) => ({
                        banner_id: banner.banner_id,
                        banner_name: banner.name,
                        domain_id: banner.domain_id
                    }))
                }
            }
        }

        await updateScanArchival(scanId, new Date(), adminUserId)

        const logDict = {
            service: 'ScanArchival',
            reference_id: scanId,
            reference_type: 'ScanID',
            event_name: 'Archived',
            details: {
                archived_by: adminUserId,
                archived_at: new Date(),
                scan_name: scan.name
            }
        }

        logger('info', 'Scan archived successfully', logDict)

        return {
            message: 'Scan deleted successfully',
            status_code: 200
        }
    } catch (error) {
        console.error('Error in archiveScanHandler:', error)
        if (error.name === 'UnexpectedError' || error.name === 'NotFoundError') {
            throw error
        }
        throw new UnexpectedError('Failed to archive scan', 500)
    }
}

async function unarchiveScanHandler(scanId, domainId, adminUserId) {
    try {
        const scan = await getScanById(scanId, domainId)

        if (!scan.archived_at) {
            return {
                message: 'Scan is already unarchived',
                status_code: 200
            }
        }
        await updateScanArchival(scanId, null, null)

        const logDict = {
            service: 'ScanUnarchival',
            reference_id: scanId,
            reference_type: 'ScanID',
            event_name: 'Unarchived',
            details: {
                unarchived_by: adminUserId,
                unarchived_at: new Date(),
                scan_name: scan.name
            }
        }

        logger('info', 'Scan unarchived successfully', logDict)

        return {
            message: 'Scan restored successfully',
            status_code: 200
        }
    } catch (error) {
        console.error('Error in unarchiveScanHandler:', error)
        if (error.name === 'UnexpectedError' || error.name === 'NotFoundError') {
            throw error
        }
        throw new UnexpectedError('Failed to unarchive scan', 500)
    }
}

export { showAllScansInDomain, showScanById, archiveScanHandler, unarchiveScanHandler }
