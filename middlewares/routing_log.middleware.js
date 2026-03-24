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

import { logger } from '../services/logger/instrumentation.services.js'
import { EXTERNAL_BANNER_BASE_PATH } from '../services/constants.js'
import get from 'lodash/get.js'
export function externalPostRoutesGenericInstrumentation(req, res, next) {
    const start = process.hrtime.bigint() // Capture high-resolution start time
    const logDict = {
        service: postRouteLabel(req),
        reference_id: req.body.data_principal_id,
        reference_type: 'DataPrincipalID',
        event_name: '',
        ou_id: get(req, 'params.bannerId')
    }
    const opts = {
        'tags': {
            'volume': {}
        }
    }
    logger('info', 'Invoked', logDict, true, opts)
    res.on('finish', () => {
        const { statusCode } = res
        const end = process.hrtime.bigint()
        const durationMs = Number(end - start) / 1_000_000 // Convert nanoseconds to ms
        logDict['event_name'] = statusCode
        opts['tags'] = {
            'tat': {
                'units': durationMs.toFixed(2),
                'scope_type': 'status_code',
                'scope_value': statusCode
            }
        }
        logger('info', 'Executed', logDict, true, opts)
    })
    next()
}

export function externalGetRoutesGenericInstrumentation(req, res, next) {
    const start = process.hrtime.bigint() // Capture high-resolution start time
    const { bannerId } = req.params
    const logDict = {
        service: getRouteLabel(req),
        reference_id: bannerId,
        reference_type: 'BannerID',
        event_name: '',
        ou_id: bannerId
    }
    const opts = {
        'tags': {
            'volume': {}
        }
    }
    logger('info', 'Invoked', logDict, true, opts)
    res.on('finish', () => {
        const { statusCode } = res
        const end = process.hrtime.bigint()
        const durationMs = Number(end - start) / 1_000_000 // Convert nanoseconds to ms
        logDict['event_name'] = statusCode
        opts['tags'] = {
            'tat': {
                'units': durationMs.toFixed(2),
                'scope_type': 'status_code',
                'scope_value': statusCode
            }
        }
        logger('info', 'Executed', logDict, true, opts)
    })

    next()
}

const prefixExternalRoutes = `${EXTERNAL_BANNER_BASE_PATH}/api/v1`

function postRouteLabel(req) {
    const url = req.originalUrl || ''
    const strippedPath = url.startsWith(prefixExternalRoutes) ? url.slice(prefixExternalRoutes.length) : url
    if (strippedPath.startsWith('/consent/')) {
        return 'CookieConsent'
    }
    if (strippedPath.startsWith('/user-interaction/events/')) {
        return 'UserInteraction'
    }

    return 'NothingMatched'
}

function getRouteLabel(req) {
    const fullPath = req.path
    const parts = fullPath.split('/').filter(Boolean)
    if (parts.length === 1) {
        return 'FetchBanner'
    } else if (parts.length === 2) {
        return 'FetchBannerWithOuid'
    } else {
        return 'NothingMatched'
    }
}
