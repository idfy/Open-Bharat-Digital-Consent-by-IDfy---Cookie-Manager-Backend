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

/* eslint-disable no-unused-vars */
/* global DEFAULT_COOKIE_CONSENT */

import { EXTERNAL_BANNER_API_GATEWAY_BASE_URL, COOKIE_LIFETIME_DAYS } from '../constants.js'
import { readFileSync } from 'fs'
import { obfuscate } from './obfuscation.services.js'
import { bannerPreferenceScreen, bannerSkeleton } from './common_banner_elements.services.js'
import { extractLanguagesFromTemplate, extractCookieNamesAndDomains } from './utils.services.js'
import { bannerInitialScreen0 } from './banner_elements.services.js'

function createBannerFunction(template, cookiePolicy) {
    const languagesMap = extractLanguagesFromTemplate(template)
    const submitConsentHandler = 'submitConsent'
    const code = `
    const COOKIE_LIFETIME_DAYS = ${COOKIE_LIFETIME_DAYS}
    const submitConsentHandler = ${submitConsentHandler};
    const cookieDetailsCache = new Map();
    const languagesMap = ${JSON.stringify(languagesMap)}
    function createBanner(categorizedCookies, template, languageEnum) {
        let banner = \`
        ${bannerInitialScreen0(languagesMap, cookiePolicy)}
        ${bannerPreferenceScreen()}
        \`;
        return banner;
    }
    `
    return code
}

function sendEventDetails(bannerId) {
    const code = `function sendEventDetails(bannerId, type) {
                    fetch(\`${EXTERNAL_BANNER_API_GATEWAY_BASE_URL}/user-interaction/events/${bannerId}\`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            sid: getSessionId(),
                            user_event: type,
                            data_principal_id: getPrivyDataPrincipalId()
                        })
                    }
                )
                .then((response) => {
                    console.log('submit response', response)
                    if (response.status === 204) {
                        console.log('Event submitted successfully')
                        return null
                    }
                })
                .catch((error) => {
                    console.error('Error submitting event:', error)
                })
            }
                `
    return code
}
function submitConsentFunction(bannerId) {
    const code = `
            function submitConsent(agreedCategories) {
                const cookieConsent = parsedConsentData(getCookieDetails(cookieName));
                processUserConsentBasedOnPreference(cookieConsent, agreedCategories, cookieName)
                setConsentedBannerId(\`${bannerId}\`)
                const requestData = { 
                    user_preference: cookieConsent, 
                    sid: getSessionId(), 
                    data_principal_id: getPrivyDataPrincipalId(),
                    submission_type: agreedCategories  
                };

                fetch(\`${EXTERNAL_BANNER_API_GATEWAY_BASE_URL}/consent/${bannerId}\`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                })
                .then(response => {
                    console.log("submit response", response);
                    if (!response.ok) {
                        throw new Error('Failed to submit consent');
                    }
                    return response.json();
                })
                .then(() => {
                    console.log('Consent submitted successfully');
                })
                .catch(error => {
                    console.error('Error submitting consent:', error);
                })
                .finally(() => {
                    location.reload();
                });
            }
        `
    return code
}

function createBannerJsFile(template, categorizedCookies, bannerId, urlsMapping, cookiePolicy) {
    const bannerFunction = generalCookieBanner(template, categorizedCookies, bannerId, urlsMapping, cookiePolicy)
    const obfuscateJsFile = obfuscate(bannerFunction)
    return obfuscateJsFile
}

function generalCookieBanner(template, categorizedCookies, bannerId, urlsMapping, cookiePolicy) {
    const autoBlockingContent = readFileSync(new URL('./auto_blocking.services.js', import.meta.url), 'utf8')
    const bannerFunctions = readFileSync(new URL('./banner_functions.services.js', import.meta.url), 'utf8')
    const minifiedCategorizedCookies = extractCookieNamesAndDomains(categorizedCookies)
    const bannerFunction = `
        const cookieName = 'privyConsent'
        const categorizedCookies = ${JSON.stringify(minifiedCategorizedCookies)};
        const tagsList = ${JSON.stringify(urlsMapping)};
        ${submitConsentFunction(bannerId)}
        ${commonBanner(template, bannerId, cookiePolicy)}
        ${bannerFunctions}
        ${autoBlockingContent}
    `
    return bannerFunction
}

function commonBanner(template, bannerId, cookiePolicy = 'abc.com') {
    const commonBannerElements = readFileSync(new URL('./common_banner_functions.services.js', import.meta.url), 'utf8')
    const bannerFunction = `
        const template = ${JSON.stringify(template)};
        const DEFAULT_COOKIE_CONSENT = {
            NECESSARY: true,
            FUNCTIONAL: false,
            ANALYTICS: false,
            MARKETING: false
            // OTHER: false
        }
        const bannerSessionId = getSessionId()
        ${sendEventDetails(bannerId)}
        ${commonBannerElements} 
        ${createBannerFunction(JSON.stringify(template), cookiePolicy)} 
        ${bannerSkeleton(bannerId)} 
        `
    return bannerFunction
}

export { createBannerJsFile }
