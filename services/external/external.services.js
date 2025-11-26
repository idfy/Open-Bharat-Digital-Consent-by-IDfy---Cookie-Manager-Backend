import { handleServiceError } from '../utils.services.js'
import { createSubmittedCookieConsent } from '../db/submitted_cookie_consent.services.js'
import { getBannerById } from '../db/banner.services.js'
import { v4 as uuidv4 } from 'uuid'
import { INSTRUMENTER_LOG_FALSE } from '../constants.js'
import { logger } from '../logger/instrumentation.services.js'
import { makeJSFile } from '../banner/banner.services.js'
import { setCache, getCache } from './lru_cache.services.js'
import { readFile } from 'fs/promises'
import path from 'path'
import { NotFoundError } from '../custom_error.js'
import { createEventAnalytics } from '../db/event_analytics.services.js'
const PROJECT_ROOT = path.resolve(process.cwd())

async function serveJSFile(bannerId) {
    try {
        const logDict = {
            service: 'FetchBanner.',
            reference_id: bannerId,
            reference_type: 'BannerId',
            event_name: '',
            ou_id: bannerId
        }
        logger('info', 'Invoked', logDict, true)

        const cached = getCache(bannerId)
        if (cached) {
            logger('info', 'Success', logDict, true)
            return cached
        }

        // 2. Read script_path from DB
        const dbBannerDetails = await getBannerById(bannerId, 'active')
        if (!dbBannerDetails) {
            throw NotFoundError('Not Found', 404)
        }
        const jsPath = dbBannerDetails['script_path']
        let jsFile = null
        const absolutePath = path.join(PROJECT_ROOT, jsPath)
        try {
            jsFile = await readFile(absolutePath, 'utf8')
        } catch (e) {
            // 4. File not found → run your fallback logic
            console.error(`File not found locally for ${jsPath}, running fallback logic`)
            jsFile = await makeJSFile(
                dbBannerDetails.scan_id,
                dbBannerDetails.domain_id,
                dbBannerDetails.banner_id,
                dbBannerDetails.template_id
            )
        }
        setCache(bannerId, jsFile)
        logger('info', 'Success', logDict, true)

        return jsFile
    } catch (error) {
        console.error(`Error Serving JS File for id ${bannerId}`, error)
        throw error
    }
}

function submitConsentLogs(logDict, userPreference, metadata, bannerId, consentId) {
    const exceptionalValues = new Set(['update'])
    const { submissionType, ip, sessionId } = metadata
    const consentBehaviourLog = {
        ...logDict,
        event_name: 'ConsentSubmissionBehaviour',
        details: {
            ip,
            submission_type: submissionType,
            banner_id: bannerId,
            consent_id: consentId,
            session_id: sessionId
        }
    }
    logger('info', 'Success', consentBehaviourLog, true, {
        log: INSTRUMENTER_LOG_FALSE
    })

    for (const categoryName in userPreference) {
        if (exceptionalValues.has(categoryName)) {
            continue
        }
        const categoryLog = {
            ...logDict,
            event_name: 'ConsentSubmissionPerCategory',
            details: {
                banner_id: bannerId,
                submission_type: submissionType,
                consent_id: consentId,
                category_name: categoryName,
                is_accepted: userPreference[categoryName],
                session_id: sessionId
            }
        }
        logger('info', 'Success', categoryLog, true, {
            log: INSTRUMENTER_LOG_FALSE
        })
    }
}

async function submitConsents(bannerId, userPreference, metadata, dataPrincipalId = uuidv4()) {
    const result = {
        message: 'Notice Submitted',
        status_code: 201,
        data_principal_id: dataPrincipalId
    }
    const logDict = {
        service: 'ConsentSubmission',
        reference_id: dataPrincipalId,
        reference_type: 'DataPrincipalID',
        event_name: 'ConsentSubmission',
        details: {
            banner_id: bannerId
        }
    }
    logger('info', 'Invoked', logDict, false, {
        log: INSTRUMENTER_LOG_FALSE
    })
    try {
        const dbData = {
            banner_id: bannerId,
            submitted_data: userPreference,
            data_principal_id: dataPrincipalId,
            metadata
        }
        const consentData = await createSubmittedCookieConsent(dbData)
        submitConsentLogs(logDict, userPreference, metadata, bannerId, consentData['id'])
        return result
    } catch (error) {
        return handleServiceError(result, error, {}, 'submitConsents')
    }
}

async function userClickHandler(bannerId, dataPrincipalId, userEvent, sessionId) {
    const start = process.hrtime.bigint() // Capture high-resolution start time
    const logDict = {
        service: 'UserClickHandler',
        reference_id: dataPrincipalId,
        reference_type: 'DataPrincipalID',
        event_name: '',
        ou_id: bannerId
    }
    const opts = {
        'tags': {
            'volume': {}
        },
        log: INSTRUMENTER_LOG_FALSE
    }
    logger('info', 'Invoked', logDict, true, opts)
    try {
        const logs = {
            service: 'ConsentView',
            reference_id: dataPrincipalId,
            reference_type: 'DataPrincipalID',
            event_name: 'ConsentView',
            details: {
                banner_id: bannerId,
                session_id: sessionId,
                user_event: userEvent
            }
        }
        logger('info', 'Invoked', logs, false, {
            log: INSTRUMENTER_LOG_FALSE
        })
        logger('info', 'Success', logs, true, {
            log: INSTRUMENTER_LOG_FALSE
        })
        const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000 // Convert nanoseconds to ms
        opts['tags']['tat'] = {
            'units': durationMs.toFixed(2)
        }
        const events = {
            banner_id: bannerId,
            data_principal_id: dataPrincipalId,
            user_event: userEvent,
            session_id: sessionId
        }
        await createEventAnalytics(events)
        logger('info', 'Success', logDict, true, opts)
    } catch (error) {
        const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000 // Convert nanoseconds to ms
        opts['tags']['tat'] = {
            'units': durationMs.toFixed(2)
        }
        logDict['details'] = {
            error: String(error)
        }
        logger('error', 'Exception', logDict, true, opts)
    }
}
export { serveJSFile, submitConsents, userClickHandler }
