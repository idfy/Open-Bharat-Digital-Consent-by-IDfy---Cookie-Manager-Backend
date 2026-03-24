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

import 'dotenv/config'
export const ADDED_BY_USER = 'MANUAL'
export const ADDED_BY_SCAN = 'SCAN'
export const CSV_ROW_LIMIT = Number(process.env.CSV_ROW_LIMIT)
export const CLOUD_PROVIDER = String(process.env.CLOUD_PROVIDER)
export const APP_BASE_URL = String(process.env.APP_BASE_URL)
export const APP_BASE_URL_API = String(process.env.APP_BASE_URL_API)
export const INTERNAL_SERVER_ERROR = 'Internal Server Error'
export const GOOGLE_APPLICATION_CREDENTIALS = String(process.env.GOOGLE_APPLICATION_CREDENTIALS)

export const INSTRUMENTER_SERVICE_CATEGORY = String(process.env.INSTRUMENTER_SERVICE_CATEGORY)
export const INSTRUMENTER_UNIVERSE = String(process.env.UNIVERSE)
export const UNIVERSE = String(process.env.UNIVERSE)
export const INSTRUMENTER_LOG = String(process.env.INSTRUMENTER_LOG) === 'true'
export const INSTRUMENTER_PUBLISH = String(process.env.INSTRUMENTER_PUBLISH) === 'true'
export const INSTRUMENTER_ASYNC = String(process.env.INSTRUMENTER_ASYNC) === 'true'
export const INSTRUMENTER_COMPONENT = String(process.env.INSTRUMENTER_COMPONENT)
export const FILE_SIZE_MB = Number(process.env.FILE_SIZE_MB) * 1024 * 1024
export const INTERNAL_SERVER_ERROR_DICT = {
    message: INTERNAL_SERVER_ERROR,
    status_code: 500
}
export const NODE_ENV = String(process.env.NODE_ENV)
export const AUTH_REDIRECT_ENDPOINT = String(process.env.AUTH_REDIRECT_ENDPOINT)
export const AUTH_SUCCESS_ENDPOINT = String(process.env.AUTH_SUCCESS_ENDPOINT)
export const DEFAULT_COOKIE_PREFERENCE = {
    necessary: true,
    performance: false,
    functional: false,
    marketing: false,
    analytics: false
    // other: false
}
export const PRIVY_CONSENT_JS_CLIENT_COOKIE_NAME = 'privyConsent'
export const INSTRUMENTER_LOG_FALSE = String(process.env.INSTRUMENTER_LOG_FALSE).toLowerCase() === 'true'
export const VALID_ROLES = process.env.VALID_ROLES?.split(',') || []
export const VALID_ROLES_SET = new Set(VALID_ROLES)
export const EDITOR_ROLES = process.env.EDITOR_ROLE?.split(',') || []
export const EDITOR_ROLES_SET = new Set(EDITOR_ROLES)
export const ENABLE_CORS_URLS = process.env.ENABLE_CORS_URLS?.split(',') || []
export const ARCHIVAL_ACCESS_ROLES = process.env.ARCHIVAL_ACCESS_ROLES?.split(',') || []
export const ARCHIVAL_ACCESS_ROLES_SET = new Set(ARCHIVAL_ACCESS_ROLES)
export const AUTH_ROUTES_BASE_PATH = '/ext/api/v1'
export const EXTERNAL_BANNER_BASE_PATH = '/ext/cookie-banner'
export const EXTERNAL_BANNER_API_GATEWAY_BASE_URL = `${APP_BASE_URL_API}/cookie-banner/api/v1`
export const EXTERNAL_BANNER_ASSETS_GATEWAY_BASE_URL = `${APP_BASE_URL}/cookie-banner/assets`

export const OBFUSCATE_JS_FILE = String(process.env.OBFUSCATE_JS_FILE).toLowerCase() === 'true'

export const BANNER_TYPE_GENERAL = 'general'
export const ALLOWED_BANNER_TYPES = [BANNER_TYPE_GENERAL]
export const ENGLISH_ENUM_VALUE = 'en'

export const COOKIE_LIFETIME_DAYS = 366
export const ROLE_DISPLAY_NAMES = {
    'privy_cm_editor': 'Cookie Manager Editor',
    'privy_cm_admin': 'Cookie Manager Administrator',
    'privy_cm_scan_operator': 'Cookie Scan Accessor'
}
export const SCAN_ACCESS_ROLES = process.env.SCAN_ACCESS_ROLES?.split(',') || []
export const SCAN_ACCESS_ROLES_SET = new Set(SCAN_ACCESS_ROLES)
export const AUTH_SECRET = String(process.env.AUTH_SECRET)
