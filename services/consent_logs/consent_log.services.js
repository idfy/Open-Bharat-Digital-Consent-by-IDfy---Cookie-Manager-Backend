import { handleServiceError } from '../utils.services.js'
import { getAllSubmittedCookieConsents } from '../db/submitted_cookie_consent.services.js'

async function showAllConsentLogs(paginationData, bannerIds, domainId) {
    let result = {
        message: 'Success',
        status_code: 200,
        data: []
    }
    try {
        if (domainId) {
            //pass
        }
        const dbDetails = await getAllSubmittedCookieConsents(paginationData, bannerIds)
        result = { ...result, ...dbDetails }
        return result
    } catch (error) {
        const results = handleServiceError(result, error, {}, 'showAllConsentLogs')
        results['data'] = []
        return results
    }
}

export { showAllConsentLogs }
