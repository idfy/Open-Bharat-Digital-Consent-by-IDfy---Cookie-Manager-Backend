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

import { VALID_ROLES_SET, AUTH_SECRET } from '../services/constants.js'
import { encode } from '@auth/core/jwt'

async function setDummySession(req, res, next) {
    if (process.env.NODE_ENV === 'development') {
        const roles = Array.from(VALID_ROLES_SET).map((roleName, index) => ({
            'id': `role-${index}-${Date.now()}`,
            'userId': 'b1c5c4ba-33a0-4bb1-8bda-3eb840473cf2',
            'roleId': `role-id-${index}`,
            'assignedAt': new Date().toISOString(),
            'assignedBy': null,
            'role': {
                'id': `role-id-${index}`,
                'name': roleName,
                'description': `${roleName} role with full system access`,
                'createdAt': new Date().toISOString(),
                'updatedAt': new Date().toISOString()
            }
        }))

        const dummyPayload = {
            'name': 'IDfy Tech',
            'email': 'tech@idfy.com',
            'sub': 'b1c5c4ba-33a0-4bb1-8bda-3eb840473cf2',
            'id': 'b1c5c4ba-33a0-4bb1-8bda-3eb840473cf2',
            roles,
            'iat': Math.floor(Date.now() / 1000),
            'exp': Math.floor(Date.now() / 1000) + 1000,
            'jti': 'b3415f36-f0b9-4f71-86ea-cbc77119d9e2'
        }
        // Use NextAuth's encode function to create a properly formatted session token
        const encryptedToken = await encode({
            token: dummyPayload,
            secret: AUTH_SECRET,
            salt: 'authjs.session-token',
            maxAge: 30 * 60 // 30 minutes
        })
        req.cookies = req.cookies || {}
        req.cookies['__Secure-authjs.session-token'] = encryptedToken

        req.current_user = {
            roles: Array.from(VALID_ROLES_SET),
            account_id: dummyPayload.id
        }
    }

    next()
}

export { setDummySession }
