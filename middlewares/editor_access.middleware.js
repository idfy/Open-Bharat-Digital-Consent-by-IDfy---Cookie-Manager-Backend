import get from 'lodash/get.js'
import { ARCHIVAL_ACCESS_ROLES_SET, EDITOR_ROLES_SET } from '../services/constants.js'
import { userHasRole } from '../services/utils.services.js'

export function checkEditorAccess(req, res, next) {
    try {
        const currentUser = get(req, 'current_user')
        const hasEditorRole = userHasRole(currentUser, EDITOR_ROLES_SET)
        const hasAdminRole = userHasRole(currentUser, ARCHIVAL_ACCESS_ROLES_SET)
        if (hasEditorRole || hasAdminRole) {
            // User has editor access
            return next()
        }

        // Otherwise deny access
        return res.status(403).json({
            message: 'Forbidden: Only editors can access this route.',
            status_code: 403,
            error_code: 'ACCESS_DENIED'
        })
    } catch (error) {
        console.error('Error in editor access middleware:', error)
        return res.status(500).json({
            message: 'Internal server error',
            status_code: 500,
            error_code: 'ACCESS_CHECK_ERROR'
        })
    }
}

export default checkEditorAccess
