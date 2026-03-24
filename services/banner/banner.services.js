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

import { getScanById } from '../db/scan.services.js'
import { handleServiceError } from '../utils.services.js'
import prisma from '../db/config.js'
import { getCookieDetailsByScanId } from '../db/cookie/common.services.js'
import {
    createBanner,
    getActiveBannerByDomainId,
    getAllBanners,
    getBannerById,
    updateBanner,
    updateBannerArchival
} from '../db/banner.services.js'
import { moveNecessaryFirst, scriptHandler } from './utils.services.js'
import { v4 as uuidv4 } from 'uuid'
import { INSTRUMENTER_LOG_FALSE, EXTERNAL_BANNER_ASSETS_GATEWAY_BASE_URL } from '../constants.js'
import { getTemplateById } from '../db/template.services.js'
import { getCookieMasterIdsByScanId } from '../db/cookie/cookie.services.js'
import { UnexpectedError } from '../custom_error.js'
import { logger } from '../logger/instrumentation.services.js'
import { addMissingValues } from '../templates/template.services.js'
import { multiLangTemplateTextToUIConfig } from '../templates/utils.js'
import { LANGUAGES_LIST_MASTER } from '../language_translation/constants.js'
import { getConfigByDomainAndType } from '../db/domain_config.service.js'
import fs from 'fs'
import path from 'path'

async function bannerCreationHandler(domainId, scanId, bannerDetails, userId) {
    const result = {
        message: 'Created',
        status_code: 201,
        banner_link: ''
    }
    const { templateId, bannerName } = bannerDetails
    const bannerId = uuidv4()
    const logDict = {
        service: 'BannerCreation',
        reference_id: bannerId,
        reference_type: 'BannerID',
        event_name: 'BannerCreation',
        details: {
            user_id: userId,
            name: bannerName,
            status: 'inactive',
            domain_id: domainId,
            scan_id: scanId
        }
    }
    logger('info', 'Invoked', logDict)
    try {
        await getScanById(scanId, domainId)
        let cookieData = await getCookieDetailsByScanId(scanId, ['en'], false)
        cookieData = moveNecessaryFirst(cookieData)
        const scriptPath = `assets/${domainId}/${bannerId}.js`
        const { nonTextConfig, textEntriesByLanguage } = await getTemplateById(templateId, LANGUAGES_LIST_MASTER)
        const template = { ...nonTextConfig, text: multiLangTemplateTextToUIConfig(textEntriesByLanguage) }
        bannerCreationChecks(cookieData)
        const completeTemplate = addMissingValues(template)
        scriptHandler(completeTemplate, cookieData, scriptPath, bannerId)
        const bannerData = {
            banner_id: bannerId,
            template_id: templateId,
            name: bannerName,
            domain_id: domainId,
            scan_id: scanId,
            script_path: scriptPath
        }

        result['banner_link'] = `${EXTERNAL_BANNER_ASSETS_GATEWAY_BASE_URL}/${bannerId}`
        await createBanner(bannerData)
        logDict['details']['script_path'] = scriptPath
        logger('info', 'Success', logDict, true)
        logDomainsPerCategory(cookieData, logDict)
        return result
    } catch (error) {
        console.log(error)
        logger('warn', 'Failed', logDict, true)
        return handleServiceError(result, error, logDict, 'bannerCreationHandler')
    }
}

async function showAllBannersInDomain(domainId, archived, page, pageSize, orderBy) {
    let result = {
        message: 'Success',
        status_code: 200,
        banners: []
    }
    try {
        if (!domainId) {
            result['message'] = 'Bad Request domain_id required'
            result['status_code'] = 400
            return result
        }
        const dbDetails = await getAllBanners(domainId, page, pageSize, orderBy, archived)
        result = { ...result, ...dbDetails }
        return result
    } catch (error) {
        const results = handleServiceError(result, error, {}, 'showAllBannersInDomain')
        results['banners'] = []
        return results
    }
}
function logDomainsPerCategory(cookieData, logDict) {
    for (const category in cookieData) {
        const uniqueDomains = [...new Set(cookieData[category].map((cookie) => cookie.cookie_domain))]
        const logData = {
            category_name: category,
            is_mandatory: category.toLowerCase() === 'necessary',
            cookie_domains: uniqueDomains
        }
        // Submit the log (replace this with your actual logging function)
        logDict['event_name'] = 'BannerCategoryToDomain'
        logDict['details'] = logData
        logger('info', 'Success', logDict, true, {
            log: INSTRUMENTER_LOG_FALSE
        })
    }
}
async function changeBannerStatusHandler(userId, domainId, bannerId, status, templateId = '') {
    // TODO

    const results = { message: 'Success', status_code: 200 }
    const data = {
        status,
        ...(templateId !== '' && {
            template_id: templateId
        })
    }
    const logDict = {
        service: 'UpdateBannerMaster',
        reference_id: bannerId,
        reference_type: 'BannerID',
        event_name: 'UpdateBannerMaster',
        details: {
            user_id: userId,
            status
        }
    }
    logger('info', 'Invoked', logDict, false)
    try {
        const scanId = await bannerActivationChecks(bannerId, domainId, status)

        let oldActiveBannerDetails = null
        let newBannerDetails = null
        let transactionSuccess = false

        if (status === 'active') {
            await prisma.$transaction(async (prismaTransaction) => {
                oldActiveBannerDetails = await deactivateActiveBanner(prismaTransaction, domainId, bannerId, logDict)
                newBannerDetails = await updateBanner(domainId, bannerId, data, prismaTransaction)
                transactionSuccess = true
            })
        } else {
            newBannerDetails = await updateBanner(domainId, bannerId, data)
            transactionSuccess = true
        }
        await makeJSFile(scanId, domainId, bannerId, newBannerDetails.template_id)
        bannerUpdateLog(transactionSuccess, oldActiveBannerDetails, newBannerDetails, logDict, domainId, status)
        return results
    } catch (error) {
        console.error('Error changing banner status:', error)
        return handleServiceError(results, error, {}, 'changeBannerStatusHandler')
    }
}
function bannerUpdateLog(transactionSuccess, oldActiveBannerDetails, newBannerDetails, logDict, domainId, status) {
    if (!transactionSuccess) {
        return
    }

    if (oldActiveBannerDetails) {
        const oldLogDict = { ...logDict }
        oldLogDict['reference_id'] = oldActiveBannerDetails['banner_id']
        oldLogDict['details'] = {
            ...logDict['details'],
            name: oldActiveBannerDetails['name'],
            scan_id: oldActiveBannerDetails['scan_id'],
            domain_id: domainId,
            status: 'inactive'
        }
        logger('info', 'Success', oldLogDict, true)
    }
    const newLogDict = { ...logDict }
    newLogDict['reference_id'] = newBannerDetails['banner_id']
    newLogDict['details'] = {
        ...logDict['details'],
        name: newBannerDetails['name'],
        scan_id: newBannerDetails['scan_id'],
        domain_id: domainId,
        status
    }
    logger('info', 'Success', newLogDict, true)
}

async function bannerActivationChecks(bannerId, domainId, status) {
    if (status !== 'active') {
        return
    }

    const bannerToActivate = await getBannerById(bannerId)
    const scanId = bannerToActivate.scan_id
    if (bannerToActivate.archived_at) {
        throw UnexpectedError('Cannot activate deleted banner', 409)
    }

    const scanDetails = await getScanById(bannerToActivate.scan_id, domainId)
    if (scanDetails?.archived_at) {
        throw UnexpectedError(
            'Cannot activate banner. The associated scan is deleted. Please restore the scan first.',
            409
        )
    }

    const templateDetails = await getTemplateById(bannerToActivate.template_id)
    if (templateDetails?.archived_at) {
        throw UnexpectedError(
            'Cannot activate banner. The associated template is deleted. Please restore the template first.',
            409
        )
    }
    return scanId
}

async function deactivateActiveBanner(prismaTransaction, domainId, bannerId) {
    // TODO
    try {
        const total = await prismaTransaction.banner.count({
            where: { domain_id: domainId }
        })
        if (total > 0) {
            const activeBannerDetails = await getActiveBannerByDomainId(domainId, prismaTransaction)
            const activeBannerId = activeBannerDetails['banner_id']
            await checkScanDetails(activeBannerDetails['scan_id'], bannerId, domainId, prismaTransaction)

            await updateBanner(domainId, activeBannerId, { status: 'inactive' }, prismaTransaction)
            return activeBannerDetails
        }
    } catch (error) {
        console.log('error', error)
        if (error.name === 'NotFoundError') {
            return null
        }
        throw error
    }
}

/**
 * Validates the cookie dictionary before banner creation.
 *
 * This function checks if the 'OTHER' category in the provided cookie dictionary
 * contains any cookies. If so, it throws a 422 Unprocessable Entity error, as banners
 * cannot be created when 'OTHER' category cookies are present.
 *
 * @function bannerCreationChecks
 * @param {Object} cookieDict - A dictionary of cookies grouped by category (e.g., ANALYTICS, MARKETING, FUNCTIONAL, OTHER).
 * @throws {UnexpectedError} Throws a 422 error if the 'OTHER' category contains any cookies.
 * @returns {Promise<void>} Resolves if validation passes with no 'OTHER' category cookies.
 */

function bannerCreationChecks(cookieDict) {
    const otherCookies = cookieDict.OTHER
    if (Array.isArray(otherCookies) && otherCookies.length > 0) {
        throw UnexpectedError('Banner creation is not allowed when "OTHER" category has cookies.', 422)
    }
}
async function checkScanDetails(scanId, bannerId, domainId, prismaTransaction) {
    const currentActiveScanId = scanId
    const activeScanDetails = await getScanById(currentActiveScanId, domainId, prismaTransaction)
    const newBannerDetails = await getBannerById(bannerId, '', prismaTransaction)
    const newScanId = newBannerDetails['scan_id']
    const newScanDetails = await getScanById(newScanId, domainId, prismaTransaction)
    console.log(
        'Timestamp Check active, old',
        activeScanDetails['created_at'],
        newScanDetails['created_at'],
        newScanDetails['created_at'] >= activeScanDetails['created_at']
    )
    if (newScanDetails['created_at'] >= activeScanDetails['created_at']) {
        return null
    }
    await compareCookieMasterIds(currentActiveScanId, newScanId)
    return null
}

async function compareCookieMasterIds(currentActiveScanId, newScanId) {
    try {
        const cookiesInActive = await getCookieMasterIdsByScanId(currentActiveScanId)
        const cookiesInNew = await getCookieMasterIdsByScanId(newScanId)
        const missingCookies = cookiesInActive.filter((cookieId) => !cookiesInNew.includes(cookieId))
        console.log('missingCookies', currentActiveScanId, newScanId, missingCookies)
        if (missingCookies.length > 0) {
            throw UnexpectedError(
                'Conflict. Cannot activate this banner as the scan used in this banner is older than current active banner and  has missing cookies.',
                409,
                {
                    data: {
                        currentActiveScanId,
                        newScanId,
                        message:
                            'The scan used in this banner is older than current active banner and  has missing cookies.'
                    }
                }
            )
        }
        return null
    } catch (error) {
        if (!error.name === 'UnexpectedError') {
            throw UnexpectedError('INTERNAL_SERVER_ERROR', 500, {
                message: 'Error comparing cookie master IDs',
                data: String(error)
            })
        }
        throw error // Re-throw the existing UnexpectedError
    }
}

async function archiveBannerHandler(bannerId, adminUserId) {
    try {
        const banner = await getBannerById(bannerId)

        if (banner.archived_at) {
            return {
                message: 'Banner already deleted',
                status_code: 200
            }
        }
        if (banner.status === 'active') {
            return {
                message: 'Cannot delete active banner. Please deactivate first.',
                status_code: 409
            }
        }
        let archivedBanner = null
        archivedBanner = await updateBannerArchival(bannerId, new Date(), adminUserId)

        const logDict = {
            service: 'BannerArchival',
            reference_id: bannerId,
            reference_type: 'BannerID',
            event_name: 'Archived',
            details: {
                archived_by: adminUserId,
                archived_at: archivedBanner.archived_at,
                banner_name: banner.name
            }
        }

        logger('info', 'Banner archived successfully', logDict)

        return {
            message: 'Banner deleted successfully',
            status_code: 200
        }
    } catch (error) {
        console.error('Error in archiveBannerHandler:', error)
        if (error.name === 'UnexpectedError' || error.name === 'NotFoundError') {
            throw error
        }
        throw UnexpectedError('INTERNAL_SERVER_ERROR', 500, {
            message: 'Error archiving banner',
            data: String(error)
        })
    }
}

async function unarchiveBannerHandler(bannerId, adminUserId) {
    try {
        const banner = await getBannerById(bannerId)

        if (!banner.archived_at) {
            return {
                message: 'Banner is already unarchived',
                status_code: 200,
                data: { banner_id: bannerId }
            }
        }

        await updateBannerArchival(bannerId, null, null)

        const logDict = {
            service: 'BannerUnarchival',
            reference_id: bannerId,
            reference_type: 'BannerID',
            event_name: 'Unarchived',
            details: {
                unarchived_by: adminUserId,
                unarchived_at: new Date(),
                banner_name: banner.name
            }
        }

        logger('info', 'Banner unarchived successfully', logDict)

        return {
            message: 'Banner restored successfully',
            status_code: 200
        }
    } catch (error) {
        console.error('Error in unarchiveBannerHandler:', error)
        if (error.name === 'UnexpectedError' || error.name === 'NotFoundError') {
            throw error
        }
        throw UnexpectedError('INTERNAL_SERVER_ERROR', 500, {
            message: 'Error unarchiving banner',
            data: String(error)
        })
    }
}

async function makeJSFile(scanId, domainId, bannerId, templateId) {
    await getScanById(scanId, domainId)
    const cookiePolicy = await getConfigByDomainAndType(domainId, 'cookie_policy_url')
    let cookieData = await getCookieDetailsByScanId(scanId, ['en'], false)
    cookieData = moveNecessaryFirst(cookieData)
    const scriptPath = `assets/${domainId}/${bannerId}.js`
    const { nonTextConfig, textEntriesByLanguage } = await getTemplateById(templateId, LANGUAGES_LIST_MASTER)
    const template = { ...nonTextConfig, text: multiLangTemplateTextToUIConfig(textEntriesByLanguage) }
    bannerCreationChecks(cookieData)
    const completeTemplate = addMissingValues(template)
    const jsFile = scriptHandler(completeTemplate, cookieData, scriptPath, bannerId, cookiePolicy)
    // Write the file to the filesystem
    writeFile(scriptPath, jsFile)
    return jsFile
}
function writeFile(scriptPath, jsFile) {
    const dir = path.dirname(scriptPath)
    fs.mkdir(dir, { recursive: true }, (mkdirErr) => {
        if (mkdirErr) {
            console.error('Error creating directory:', mkdirErr)
            return
        }
        fs.writeFile(scriptPath, jsFile, (err) => {
            if (err) {
                console.error('Error writing file:', err)
            } else {
                console.log('cookie-banner file has been created!', scriptPath)
            }
        })
    })
}
export {
    bannerCreationHandler,
    showAllBannersInDomain,
    changeBannerStatusHandler,
    archiveBannerHandler,
    unarchiveBannerHandler,
    makeJSFile
}
