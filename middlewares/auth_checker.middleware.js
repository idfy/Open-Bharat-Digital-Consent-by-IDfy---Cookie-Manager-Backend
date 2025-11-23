import { AUTH_REDIRECT_ENDPOINT, VALID_ROLES_SET, AUTH_SECRET } from '../services/constants.js'
import { jwtDecrypt } from 'jose'

const secret = new TextEncoder().encode(AUTH_SECRET)

function validateRoles(roles) {
    return Array.isArray(roles) && roles.some((role) => VALID_ROLES_SET.has(role))
}

function createUserInfo(payload) {
    return {
        roles: payload.roles,
        account_id: payload.user_id
    }
}

async function sessionChecker(req, res, next) {
    const redirectionData = {
        message: 'Unauthenticated',
        redirection: true,
        data: { redirect_url: AUTH_REDIRECT_ENDPOINT }
    }
    const idTokenEncoded = req.cookies['__Secure-authjs.session-token'] || req.cookies['authjs.session-token']
    if (!idTokenEncoded) {
        console.error('Failed', 'EMPTY_ID_TOKEN')
        redirectionData.message = 'No authentication token'
        return res.status(401).json(redirectionData)
    }
    try {
        const { payload } = await jwtDecrypt(idTokenEncoded, secret)
        console.log('Decrypted payload:', payload)
        if (!payload.roles || !payload.user_id || !validateRoles(payload.roles)) {
            console.error('Failed', 'INVALID_TOKEN_CONTENTS')
            redirectionData.message = 'Invalid token'
            return res.status(403).json(redirectionData)
        }

        req.current_user = createUserInfo(payload)
        next()
    } catch (error) {
        console.log('Exception', 'TOKEN_DECODE_ERROR', { error: error.message })
        redirectionData.message = 'Authentication failed'
        return res.status(401).json(redirectionData)
    }
}
export { sessionChecker }

