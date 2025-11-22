import { INTERNAL_SERVER_ERROR_DICT } from '../services/constants.js'
import { initiateScanHandler } from '../services/scraper/scraper.services.js'
import get from 'lodash/get.js'

async function initiateScan(req, res) {
    try {
        const domainId = get(req, 'body.domain_id')
        const results = await initiateScanHandler(domainId)
        return res.status(results['status_code']).json(results)
    } catch (error) {
        return res
            .status(INTERNAL_SERVER_ERROR_DICT['status_code'])
            .json(INTERNAL_SERVER_ERROR_DICT)
    }
}

export { initiateScan }
