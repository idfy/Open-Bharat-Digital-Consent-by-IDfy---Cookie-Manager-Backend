import {
    INSTRUMENTER_SERVICE_CATEGORY,
    INSTRUMENTER_UNIVERSE,
    INSTRUMENTER_LOG,
    INSTRUMENTER_PUBLISH,
    INSTRUMENTER_ASYNC,
    INSTRUMENTER_COMPONENT
} from '../constants.js'
import fs from 'fs'
const pkg = JSON.parse(fs.readFileSync(new URL('../../package.json', import.meta.url)))

function logger(logType, eventType, logDict, publish = INSTRUMENTER_PUBLISH, opts = {}) {
    const event = {
        app_vsn: pkg.version,
        eid: undefined,
        timestamp: new Date().toISOString(), // Date should be in ISO format
        x_request_id: null,
        event_source: null,
        log_level: String(logType).toUpperCase(),
        service_category: INSTRUMENTER_SERVICE_CATEGORY,
        universe: INSTRUMENTER_UNIVERSE,
        ou_id: logDict.ou_id,
        correlation_id: null,
        reference_id: logDict.reference_id,
        reference_type: logDict.reference_type,
        component: logDict.component || INSTRUMENTER_COMPONENT,
        service: logDict.service,
        event_type: eventType,
        event_value: logDict.event_name,
        log_version: logDict.log_version || 'v1',
        details: logDict.details || {}, // Should be a valid json or null,
        tags: opts.tags ?? {}
    }
    const options = {
        log: opts.log ?? INSTRUMENTER_LOG,
        publish,
        async: opts.async ?? INSTRUMENTER_ASYNC
    }
    const logData = { event, options }
    const output = JSON.stringify(logData)
    if (logType === 'info') {
        console.log(output)
    } else if (logType === 'error') {
        console.error(output)
    } else if (logType === 'warn') {
        console.warn(output)
    } else if (logType === 'critical') {
        console.error('CRITICAL:', output)
    } else if (logType === 'debug') {
        console.log('DEBUG', output)
    }
}

export { logger }
