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

import { createBannerJsFile } from './cookie_banner_creation.services.js'
import { UnexpectedError } from '../custom_error.js'
import { LANGUAGES_MAP_MASTER } from '../language_translation/constants.js'

function mapUrlsToCategories(data) {
    const urlsMapping = new Map()
    for (const [category, items] of Object.entries(data)) {
        processRequestChain(items, category, urlsMapping)
    }
    return [...urlsMapping.values()]
}

function processRequestChain(items, category, urlsMapping) {
    for (const item of items) {
        const requestChain = getRequestChain(item)
        if (!requestChain) {
            continue
        }

        const type = normalizeType(requestChain.type)
        addUrlsToMapping(requestChain.sourceUrls, category, type, urlsMapping)
    }
}

function getRequestChain(item) {
    return item.meta_data?.requestChain || null
}

function normalizeType(type) {
    return type === 'parser' ? 'script' : type
}

function addUrlsToMapping(urls, category, type, urlsMapping) {
    urls.forEach((url) => {
        if (urlsMapping.has(url)) {
            const existingEntry = urlsMapping.get(url)
            if (!existingEntry.categories.includes(category)) {
                existingEntry.categories.push(category)
            }
        } else {
            urlsMapping.set(url, { tag: url, categories: [category], type })
        }
    })
}

function scriptHandler(template, categorizedCookies, path, bannerId, cookiePolicy) {
    try {
        const urlsMapping = mapUrlsToCategories(categorizedCookies)
        const jsContent = createBannerJsFile(template, categorizedCookies, bannerId, urlsMapping, cookiePolicy)
        return jsContent
    } catch (error) {
        throw UnexpectedError('Error in uploadFileStream', 500, {
            message: 'Error generating script',
            data: String(error)
        })
    }
}

function extractLanguagesFromTemplate(templateString) {
    const template = JSON.parse(templateString)
    const languageContainer = template?.text || {}
    const languageCodesInTemplate = Object.keys(languageContainer)
    const validLanguageCodes = languageCodesInTemplate.filter((code) =>
        Object.prototype.hasOwnProperty.call(LANGUAGES_MAP_MASTER, code)
    )
    const languageMap = {}
    for (const code of validLanguageCodes) {
        languageMap[code] = LANGUAGES_MAP_MASTER[code]
    }
    return languageMap
}

function moveNecessaryFirst(data) {
    return Object.fromEntries([
        ...(data.NECESSARY ? [['NECESSARY', data.NECESSARY]] : []),
        ...Object.entries(data).filter(([key]) => key !== 'NECESSARY')
    ])
}

function extractCookieNamesAndDomains(categorizedCookiesData) {
    const result = {}

    for (const category in categorizedCookiesData) {
        if (Object.hasOwnProperty.call(categorizedCookiesData, category)) {
            const cookiesInCategory = categorizedCookiesData[category]

            result[category] = cookiesInCategory.map((cookie) => ({
                cookie_master_name: cookie.cookie_master_name,
                cookie_domain: cookie.cookie_domain
            }))
        }
    }
    return result
}

export { scriptHandler, moveNecessaryFirst, extractLanguagesFromTemplate, extractCookieNamesAndDomains }
