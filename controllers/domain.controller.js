import { INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_DICT } from '../services/constants.js'
import { addDomainHandler, showAllDomainsInOrg } from '../services/domain/domain.services.js'
import { getPaginationParams } from '../services/utils.services.js'
import get from 'lodash/get.js'

async function addDomain(req, res) {
    try {
        const url = get(req, 'body.url')
        const userId = get(req, 'current_user.account_id')
        const results = await addDomainHandler(url, userId)
        return res.status(results['status_code']).json(results)
    } catch (error) {
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}

async function showDomains(req, res) {
    try {
        const { page, pageSize, orderBy } = getPaginationParams(req)
        const results = await showAllDomainsInOrg(page, pageSize, orderBy)
        return res.status(results['status_code']).json(results)
    } catch (error) {
        console.log('Error in showDomains', error)
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json({ message: INTERNAL_SERVER_ERROR })
    }
}

export { addDomain, showDomains }
