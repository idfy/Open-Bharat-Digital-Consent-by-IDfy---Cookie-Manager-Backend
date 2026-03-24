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

// Base function for creating custom exceptions
function createException(status_code = 500, message = '', data = {}) {
    const error = new Error(message)
    error.name = 'BaseException'
    error.status_code = status_code
    error.data = data || {}
    return error
}

function NotFoundError(message, status_code = 404, data = {}) {
    const error = createException(status_code, message, data)
    error.name = 'NotFoundError'
    return error
}

function UnexpectedError(message, status_code = 500, data = {}) {
    const error = createException(status_code, message, data)
    error.name = 'UnexpectedError'
    return error
}
function JoiValidationError(message, status_code = 400, data = {}) {
    const error = createException(status_code, message, data)
    error.name = 'JoiValidationError'
    return error
}

function HTTPError(message, status_code = 500, data = {}) {
    const error = createException(status_code, message, data)
    error.name = 'HTTPError'
    console.log(error)
    return error
}
const ERROR_TYPE_SET = new Set([
    'HTTPError',
    'UnexpectedError',
    'NotFoundError',
    'JoiValidationError'
])

export {
    NotFoundError,
    UnexpectedError,
    HTTPError,
    JoiValidationError,
    ERROR_TYPE_SET
}
