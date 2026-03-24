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

import get from 'lodash/get.js'
import {
    bannerCreationHandler,
    showAllBannersInDomain,
    changeBannerStatusHandler,
    archiveBannerHandler,
    unarchiveBannerHandler
} from '../services/banner/banner.services.js'
import { INTERNAL_SERVER_ERROR_DICT, DEFAULT_COOKIE_PREFERENCE } from '../services/constants.js'
import { getPaginationParams } from '../services/utils.services.js'

async function createBanner(req, res) {
    try {
        const domainId = get(req, 'body.domain_id')
        const templateId = get(req, 'body.template_id')
        const bannerName = get(req, 'body.banner_name', 'Auto Generated')
        const scanId = get(req, 'body.scan_id')
        const userId = get(req, 'current_user.account_id')
        const cookiePreference = get(req, 'cookie_preference', DEFAULT_COOKIE_PREFERENCE)
        const bannerDetails = {
            bannerName,
            templateId,
            cookiePreference
        }
        const results = await bannerCreationHandler(domainId, scanId, bannerDetails, userId)
        return res.status(results['status_code']).json(results)
    } catch (error) {
        console.error('Error in createBanner', error)
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}

async function showBanners(req, res) {
    try {
        const domainId = get(req, 'params.domainId')
        const archived = get(req, 'query.archived', 'false') // Default to show only active (non-archived)
        const { page, pageSize, orderBy } = getPaginationParams(req)
        const results = await showAllBannersInDomain(domainId, archived, page, pageSize, orderBy)
        return res.status(results['status_code']).json(results)
    } catch (error) {
        console.log('Error in showBanners', error)
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}
async function changeBannerStatus(req, res) {
    try {
        const domainId = get(req, 'body.domain_id')
        const bannerId = get(req, 'body.banner_id')
        const userId = get(req, 'current_user.account_id')
        const status = get(req, 'body.status')
        const templateId = ''
        const results = await changeBannerStatusHandler(userId, domainId, bannerId, status, templateId)
        return res.status(results['status_code']).json(results)
    } catch (error) {
        console.log('Error in changeBannerStatus', error)
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}

async function archiveBanner(req, res) {
    try {
        const bannerId = get(req, 'params.bannerId')
        const userId = get(req, 'current_user.account_id')

        const results = await archiveBannerHandler(bannerId, userId)
        return res.status(results['status_code']).json(results)
    } catch (error) {
        console.error('Error in archiveBanner', error)
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}

async function unarchiveBanner(req, res) {
    try {
        const bannerId = get(req, 'params.bannerId')
        const userId = get(req, 'current_user.account_id')

        const results = await unarchiveBannerHandler(bannerId, userId)
        return res.status(results['status_code']).json(results)
    } catch (error) {
        console.error('Error in unarchiveBanner', error)
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}

export { createBanner, showBanners, changeBannerStatus, archiveBanner, unarchiveBanner }
