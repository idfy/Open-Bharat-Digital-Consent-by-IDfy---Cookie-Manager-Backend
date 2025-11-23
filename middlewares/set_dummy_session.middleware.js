import { VALID_ROLES_SET, AUTH_SECRET } from '../services/constants.js'
import { CompactEncrypt } from 'jose'

const encoder = new TextEncoder()
const secretKey = encoder.encode(AUTH_SECRET) // must match jwtDecrypt EXACTLY

async function setDummySession(req, res, next) {
    if (process.env.NODE_ENV === 'development') {
        const dummyPayload = {
            roles: Array.from(VALID_ROLES_SET),
            user_id: '1150e434-ccd3-4bc8-a51a-74015b5b24fb'
        }

        const payloadBytes = encoder.encode(JSON.stringify(dummyPayload))

        const encryptedToken = await new CompactEncrypt(payloadBytes)
            .setProtectedHeader({
                alg: 'dir',
                enc: 'A128GCM' // must match production encryption
            })
            .encrypt(secretKey)

        req.cookies = req.cookies || {}
        req.cookies['__Secure-authjs.session-token'] = encryptedToken

        req.current_user = {
            roles: dummyPayload.roles,
            account_id: dummyPayload.user_id
        }
    }

    next()
}

export { setDummySession }
