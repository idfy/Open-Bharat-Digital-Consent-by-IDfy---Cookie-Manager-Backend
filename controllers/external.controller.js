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

import get from 'lodash/get.js'
import { serveJSFile, submitConsents, userClickHandler } from '../services/external/external.services.js'
import { INTERNAL_SERVER_ERROR_DICT } from '../services/constants.js'
async function sendJSFile(req, res) {
    try {
        const bannerId = get(req, 'params.bannerId')
        const jsContent = await serveJSFile(bannerId)
        res.setHeader('Cache-Control', 'public, max-age=604800') // 7 day
        return res.status(200).type('js').send(jsContent)
    } catch (error) {
        console.error('Error in sendJSFile', error)
        let jsContent = 'console.log("Script Failed for dynamic link ");'
        if (error.name && error.name === 'NotFoundError') {
            jsContent = 'Not Found'
        }
        const statusCode = error.status_code || 500
        return res.status(statusCode).type('js').send(jsContent)
    }
}

async function submitConsent(req, res) {
    try {
        const bannerId = get(req, 'params.bannerId')
        const userPreference = get(req, 'body.user_preference')
        const sessionId = get(req, 'body.sid')
        const dataPrincipalId = get(req, 'body.data_principal_id')
        const submissionType = get(req, 'body.submission_type', 'all')

        const ip =
            req.headers['cf-connecting-ip'] ||
            req.headers['x-real-ip'] ||
            req.headers['x-forwarded-for'] ||
            req.socket.remoteAddress ||
            ''
        const metadata = {
            userAgent: get(req.headers, 'user-agent', 'No userAgent'),
            ip,
            sessionId,
            submissionType
        }
        const results = await submitConsents(bannerId, userPreference, metadata, dataPrincipalId)
        return res.status(results['status_code']).json(results)
    } catch (error) {
        console.error('Error in submitConsent', error)
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}
function userClickEvents(req, res) {
    try {
        const bannerId = get(req, 'params.bannerId')
        const userEvent = get(req, 'body.user_event')
        const dataPrincipalId = get(req, 'body.data_principal_id')
        const sessionId = get(req, 'body.sid')
        userClickHandler(bannerId, dataPrincipalId, userEvent, sessionId)
        return res.status(204).end()
    } catch {
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}
export { sendJSFile, submitConsent, userClickEvents }
