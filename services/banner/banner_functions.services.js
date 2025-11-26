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

/* global toggleBanner  setCookieOnBrowser  sendEventDetails  autoBlocking */

// eslint-disable-next-line no-unused-vars
function processUserConsentBasedOnPreference(cookieConsent, agreedCategories, cookieName, COOKIE_LIFETIME_DAYS) {
    const agreedCookies = []
    if (agreedCategories === 'all') {
        Object.keys(cookieConsent).forEach((key) => (cookieConsent[key] = true))
    } else if (agreedCategories === 'necessary') {
        Object.keys(cookieConsent).forEach((key) => (cookieConsent[key] = key === 'NECESSARY'))
    } else if (agreedCategories === 'preference') {
        const checkedBoxes = document.querySelectorAll(
            'input[type="checkbox"].toggle-switch-privy-cmp-AE1VSVI8T5:checked'
        )
        checkedBoxes.forEach((box) => {
            const categoryName = box.id.replace('-toggle-privy-cmp-AE1VSVI8T5', '')
            agreedCookies.push(categoryName)
            cookieConsent[categoryName] = true
        })
        Object.keys(cookieConsent).forEach((key) => (cookieConsent[key] = agreedCookies.includes(key)))
    }
    cookieConsent.update = true
    cookieConsent['NECESSARY'] = true
    toggleBanner('hide')
    setCookieOnBrowser(cookieConsent, cookieName, COOKIE_LIFETIME_DAYS)
    return cookieConsent
}
// eslint-disable-next-line no-unused-vars
function showDropdown(category) {
    const dropdown = document.getElementById(`dropdown-${category}-privy-cmp-AE1VSVI8T5`)
    const allCookies = document.getElementById(`all-cookies-privy-cmp-AE1VSVI8T5-${category}`)
    const dropIcon = document.querySelector(`.dropdown-arrow-${category}-privy-cmp-AE1VSVI8T5`)
    if (dropdown.style.display === 'block' || allCookies.style.display === 'block') {
        dropdown.style.display = 'none'
        allCookies.style.display = 'none'
        dropIcon.classList.add('rotated-privy-cmp-AE1VSVI8T5')
    } else {
        dropdown.style.display = 'block'
        dropIcon.classList.remove('rotated-privy-cmp-AE1VSVI8T5')
    }
}
// eslint-disable-next-line no-unused-vars
function viewCookieDetails(category) {
    const allCookies = document.getElementById(`all-cookies-privy-cmp-AE1VSVI8T5-${category}`)
    allCookies.style.display = 'block'

    const dropdown = document.getElementById(`dropdown-${category}-privy-cmp-AE1VSVI8T5`)
    dropdown.style.display = 'none'
}

// eslint-disable-next-line no-unused-vars
function setupBannerBasedOnConsentGeneral(consentCookie, bannerId) {
    if (consentCookie.update === true) {
        toggleBanner('hide')
    } else {
        toggleBanner('show')
        sendEventDetails(bannerId, 'BannerView')
    }
    autoBlocking()
}
