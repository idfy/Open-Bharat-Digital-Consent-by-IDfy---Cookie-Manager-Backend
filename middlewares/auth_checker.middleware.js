import { AUTH_REDIRECT_ENDPOINT, VALID_ROLES_SET, AUTH_SECRET } from '../services/constants.js'
import { decode } from '@auth/core/jwt'

function validateRoles(roles) {
    return Array.isArray(roles) && roles.some((role) => VALID_ROLES_SET.has(role))
}

function createUserInfo(payload, roles) {
    return {
        roles,
        account_id: payload.id
    }
}

async function sessionChecker(req, res, next) {
    const redirectionData = {
        message: 'Unauthenticated',
        redirection: true,
        data: { redirect_url: AUTH_REDIRECT_ENDPOINT }
    }
    const tokenCookieName = req.cookies['__Secure-authjs.session-token'] ? '__Secure-authjs.session-token' : 'authjs.session-token'
    const idTokenEncoded = req.cookies[tokenCookieName]

    if (!idTokenEncoded) {
        console.error('Failed', 'EMPTY_ID_TOKEN')
        redirectionData.message = 'No authentication token'
        return res.status(401).json(redirectionData)
    }
    try {
        // Use NextAuth's decode function which handles key derivation automatically
        const payload = await decode({
            token: idTokenEncoded,
            secret: AUTH_SECRET,
            salt: tokenCookieName
        })
        const roles = payload.roles?.map((r) => r.role.name) || []
        const currentTime = Math.floor(Date.now() / 1000)
        if (!payload?.id || !validateRoles(roles) || !payload?.exp || currentTime >= payload.exp) {
            console.error('Failed', 'INVALID_TOKEN_CONTENTS')
            redirectionData.message = 'Invalid token'
            return res.status(403).json(redirectionData)
        }

        req.current_user = createUserInfo(payload, roles)
        next()
    } catch (error) {
        console.log('Exception', 'TOKEN_DECODE_ERROR', { error: error.message })
        redirectionData.message = 'Authentication failed'
        return res.status(401).json(redirectionData)
    }
}
export { sessionChecker }
