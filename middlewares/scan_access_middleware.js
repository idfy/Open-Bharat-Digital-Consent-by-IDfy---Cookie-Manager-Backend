import { ARCHIVAL_ACCESS_ROLES_SET, EDITOR_ROLES_SET, SCAN_ACCESS_ROLES_SET } from '../services/constants.js'
import get from 'lodash/get.js'
import { userHasRole } from '../services/utils.services.js'

export function checkScanAccess(req, res, next) {
    try {
        const currentUser = get(req, 'current_user')
        const hasScanAccessRole = userHasRole(currentUser, SCAN_ACCESS_ROLES_SET)
        const hasEditorRole = userHasRole(currentUser, EDITOR_ROLES_SET)
        const hasAdminRole = userHasRole(currentUser, ARCHIVAL_ACCESS_ROLES_SET)
        if (hasEditorRole || hasScanAccessRole || hasAdminRole) {
            return next()
        }

        // If user does NOT have any of the above role → disallow
        return res.status(403).json({
            message: 'Forbidden: You do not have the required access.',
            status_code: 403,
            error_code: 'ACCESS_DENIED'
        })
    } catch (error) {
        console.error('Error in scan access middleware:', error)
        return res.status(500).json({
            message: 'Internal server error',
            status_code: 500,
            error_code: 'ACCESS_CHECK_ERROR'
        })
    }
}

export default checkScanAccess
