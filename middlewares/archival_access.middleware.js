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

import { ARCHIVAL_ACCESS_ROLES_SET } from '../services/constants.js'
import { getArchivalRoles } from '../services/utils.services.js'
import get from 'lodash/get.js'

export function checkArchivalAccess(req, res, next) {
    try {
        const currentUser = get(req, 'current_user')
        
        // Validate user and roles structure
        const hasAccess = currentUser && 
                         currentUser.roles && 
                         Array.isArray(currentUser.roles) &&
                         currentUser.roles.some(role => 
                             ARCHIVAL_ACCESS_ROLES_SET.has(role.toLowerCase())
                         )
        if (!hasAccess) {
            const rolesDisplay = getArchivalRoles()
                
            return res.status(403).json({
                message: `Forbidden: User must have access to one of the following roles: ${rolesDisplay}`,
                status_code: 403,
                error_code: 'ACCESS_DENIED'
            })
        }

        next()
    } catch (error) {
        console.error('Error in archival access middleware:', error)
        return res.status(500).json({
            message: 'Internal server error',
            status_code: 500,
            error_code: 'ACCESS_CHECK_ERROR'
        })
    }
}

export default checkArchivalAccess
