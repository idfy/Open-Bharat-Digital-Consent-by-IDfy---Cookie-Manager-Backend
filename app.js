import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import baseRoutes from './routes/base.js'
import scanRoutes from './routes/scan.js'
import bannerRoutes from './routes/banner.js'
import cookieRoutes from './routes/cookie.js'
import externalAPIRoutes from './routes/external_api.js'
import externalAssetsRoutes from './routes/external_assets.js'
import consentLogRoutes from './routes/consent_logs.js'
import translationRoutes from './routes/translation.js'
import { sessionChecker } from './middlewares/auth_checker.middleware.js'
import securityHeadersMiddleware from './middlewares/security_headers.middleware.js'
// eslint-disable-next-line no-unused-vars
import { FILE_SIZE_MB } from './services/constants.js'
import domainRoutes from './routes/domain.js'
import templateRoutes from './routes/template.js'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { ENABLE_CORS_URLS, AUTH_ROUTES_BASE_PATH, EXTERNAL_BANNER_BASE_PATH } from './services/constants.js'
const app = express()

const morganLogger = morgan(':method :url :status  - :response-time ms', {
    skip: (req, res) => res.statusCode === 304
})
app.use(morganLogger) //combined
app.use(cookieParser())
app.use(
    cors({
        origin: ENABLE_CORS_URLS,
        methods: ['GET', 'POST']
    })
)

app.use(bodyParser.urlencoded({ extended: true }))

app.use((req, res, next) => {
    bodyParser.json({ limit: FILE_SIZE_MB })(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                message: 'Invalid JSON format. Please check your request.'
            })
        }
        next()
    })
})

function isValidUrl(urlString) {
    try {
        decodeURIComponent(urlString)
        return true
    } catch (error) {
        return false
    }
}

function validateUrl(req, res, next) {
    const urlString = req.url
    if (isValidUrl(urlString)) {
        next()
    } else {
        return res.status(400).json({ message: 'Invalid URL format. Please check your request.' })
    }
}

app.use(validateUrl)

const nonce = '5edc28a1-4733-405c-9d4b-8f0c32c8df93'
app.disable('x-powered-by')
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        `
        default-src 'self';
        img-src 'self';
        style-src 'self' nonce-${nonce};
        connect-src 'self';
        object-src 'none';
        script-src 'self' nonce-${nonce};
        font-src 'self' ;
        frame-src 'self';
      `
            .replace(/\s+/g, ' ')
            .trim()
    )
    res.setHeader('Cache-Control', 'no-store, no-cache, max-age=0')
    res.setHeader('Expires', '0')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('Strict-Transport-Security', 'max-age=31536000')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    if (req.url === '/') {
        let cookies = req.headers.cookie
        if (cookies !== undefined) {
            cookies = cookies.split('').map((cookie) => cookie.trim())
            cookies = cookies.map((cookie) => `${cookie} Secure HttpOnly SameSite=Strict`)
            res.setHeader('Set-Cookie', cookies)
        }
    }
    next()
})
app.use((req, res, next) => {
    const methods = ['GET', 'POST', 'PUT', 'PATCH']
    if (!methods.includes(req.method)) {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }
    next()
})

app.use(baseRoutes)

// Routes requiring auth starts here
// Middleware to set a constant dummy session for local development
// import { setDummySession } from './middlewares/set_dummy_session.middleware.js'
//add setDummySession as middleware before sessionChecker to set dummy session on local
const routesWithAuth = [
    { path: '', router: scanRoutes },
    { path: '', router: domainRoutes },
    { path: '', router: bannerRoutes },
    { path: '', router: templateRoutes },
    { path: '', router: cookieRoutes },
    { path: '', router: consentLogRoutes },
    { path: '/translate', router: translationRoutes }
]
routesWithAuth.forEach(({ path, router }) => {
    const fullPath = path === '' ? AUTH_ROUTES_BASE_PATH : `${AUTH_ROUTES_BASE_PATH}${path}`
    app.use(fullPath, securityHeadersMiddleware, sessionChecker, router)
})
//routes with auth ends here
const bannerRoutesExternal = [
    { path: '/assets', router: externalAssetsRoutes },
    { path: '/api/v1', router: externalAPIRoutes }
]
bannerRoutesExternal.forEach(({ path, router }) => {
    const fullPath = path === '' ? EXTERNAL_BANNER_BASE_PATH : `${EXTERNAL_BANNER_BASE_PATH}${path}`
    app.use(fullPath, router)
})

app.get('*', function (req, res) {
    return res.status(404).json({ message: 'Oops route not found' })
})

app.listen(process.env.PORT, function () {
    console.log('Server running on PORT', process.env.PORT)
})

// module.exports = app;
