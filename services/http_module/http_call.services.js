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

import axios from 'axios'
import _ from 'lodash'
import { customSleep } from '../utils.services.js'
import { HTTPError, UnexpectedError } from '../custom_error.js'
import { INTERNAL_SERVER_ERROR } from '../constants.js'

/**
 * Makes an HTTP request with exponential backoff retry capability.
 *
 * @param {Object} http_details - The details of the HTTP request.
 * @param {string} http_details.method - The HTTP method (e.g., 'get', 'post', 'put', 'delete').
 * @param {string} http_details.url - The URL for the HTTP request.
 * @param {Object} [http_details.headers] - The headers to include in the request.
 * @param {Object} [http_details.params] - The parameters to include in the request body for POST/PUT requests. - Optional for get types
 * @param {string} [http_details.response_type] - Optional. The response type (e.g., 'json', 'arraybuffer'). If mentioned defaults to json according to axios
 * @param {number[]} [http_details.no_retry_status_codes=[400, 401, 403, 404, 405, 413, 414]] - Optional. Status codes that should not trigger a retry.
 * @param {number} [http_details.base_value_of_exponential_wait_time=2] - Optional. Base value for exponential backoff wait time.
 * @param {number} [http_details.max_power_of_exponential_wait_time=2] - Optional. Maximum power for exponential backoff wait time.
 * @param {number} [max_retries=3] - Optional. The maximum number of retry attempts in case of failure.
 * @param {number} [current_retry=0] - Optional. The current retry attempt number. Don't pass it while calling function
 * @returns {Promise<Object>} The response from the HTTP request.
 * @throws {HTTPError} Throws a custom HTTPError on failure with a message and optional data.
 */
async function httpCall(http_details, max_retries = 3, current_retry = 0) {
    const method = _.get(http_details, 'method')
    const url = _.get(http_details, 'url')
    const headers = _.get(http_details, 'header', '')
    const params = _.get(http_details, 'params', {})
    const responseType = _.get(http_details, 'response_type', '')
    const no_retry_status_codes = _.get(http_details, 'no_retry_status_codes', [400, 401, 403, 404, 405, 413, 414])
    const base_value_of_exponential_wait_time = _.get(http_details, 'base_value_of_exponential_wait_time', 2)
    const max_power_of_exponential_wait_time = _.get(http_details, 'max_power_of_exponential_wait_time', 2)

    const config = {
        method,
        url,
        ...(headers && { headers }),
        ...(responseType && { responseType }),
        ...(method === 'get' && { params }),
        ...(['post', 'put'].includes(method) && { data: params })
    }
    try {
        const response = await axios(config)
        const status_code = response.status
        if (status_code >= 200 && status_code < 300) {
            return response
        }
        if (current_retry < max_retries && !no_retry_status_codes.includes(status_code)) {
            console.log(`current_retrying ${current_retry} attempts left...`)
            const wait_time_ms =
                base_value_of_exponential_wait_time ** Math.min(current_retry, max_power_of_exponential_wait_time) *
                1000
            await customSleep(wait_time_ms)
            return await httpCall(http_details, max_retries, current_retry + 1)
        } else {
            console.log('MAx retries reached or status_code in no_retry_status_codes')
            throw HTTPError('Max retries reached or status_code in no_retry_status_codes.', status_code, {
                message: 'Max retries reached or status_code in no_retry_status_codes.',
                data: response.data
            })
        }
    } catch (error) {
        console.error('Error making HTTP request:')
        if (error.name === 'HTTPError') {
            throw error
        }
        if (error.response && error.response.data) {
            throw HTTPError('Error making HTTP request', error.response.status, {
                message: 'Error making HTTP request',
                data: error.response.data
            })
        }
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            message: INTERNAL_SERVER_ERROR,
            data: sanitizeError(error)
        })
    }
}

function sanitizeError(error) {
    try {
        // If no error, return as is
        if (!error) {
            return error
        }
        const sanitizedError = { ...error }
        // Remove headers from config
        if (sanitizedError.config && sanitizedError.config.headers) {
            delete sanitizedError.config.headers
        }
        // Remove headers from request (ClientRequest)
        if (sanitizedError.request) {
            deleteHeadersFromErrorLogs(sanitizedError.request)
        }
        return sanitizedError
    } catch (error) {
        return 'Unknown sanitization error'
    }
}
function deleteHeadersFromErrorLogs(sanitizedErrorRequest) {
    if (sanitizedErrorRequest._headers) {
        delete sanitizedErrorRequest._headers
    }
    if (sanitizedErrorRequest._currentRequest && sanitizedErrorRequest._currentRequest._header) {
        delete sanitizedErrorRequest._currentRequest._header
    }
}
export { httpCall }
