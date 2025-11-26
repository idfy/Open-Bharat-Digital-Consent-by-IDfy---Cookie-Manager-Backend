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

/* eslint-disable */

const nonScriptElements = ['embed', 'iframe', 'img', 'script']
const monitoredElements = [...nonScriptElements, 'script']

function findMatchingTag(url) {
    return tagsList.find((item) => url.includes(item.tag)) || null
}
function getUrlDetails(url) {
    const tagDetails = findMatchingTag(url) || {}
    return {
        categories: tagDetails.categories || [],
        type: tagDetails.type || ''
    }
}
function checkConsent(categories, consentObject) {
    if (!consentObject) return false
    return categories.every((category) => consentObject[category] === true)
}

function hasUserConsent(categories, defaultConsent = DEFAULT_COOKIE_CONSENT) {
    if (!categories || categories.length === 0) {
        return true
    }
    const cookieDetails = getCookieDetails(cookieName, defaultConsent)
    const consent = parsedConsentData(cookieDetails)
    return checkConsent(categories, consent)
}

function addPrivacyClasses(element, categories) {
    if (categories.length) {
        categories.forEach((category) => {
            const className = `privy-cmp-category-${category}`
            if (!element.classList.contains(className)) {
                element.classList.add(className)
            }
        })
    }
}

function handleTags(element) {
    const url = element.src || element.getAttribute('src') || ''
    if (!url) return

    const tagDetails = getUrlDetails(url)
    const categories = tagDetails.categories
    const type = tagDetails.type

    // Add privacy classes
    addPrivacyClasses(element, categories)

    if (!hasUserConsent(categories)) {
        const originalSrc = url
        if (type === 'script') {
            element.type = 'text/plain'
            element.setAttribute('privy-data-src', originalSrc)
            element.removeAttribute('src')
            console.log(`Script blocked: ${url}`, type, categories)
        } else if (nonScriptElements.includes(element.tagName.toLowerCase())) {
            element.type = 'text/plain'
            element.setAttribute('privy-data-src', originalSrc)
            element.removeAttribute('src')
            console.log(`Media element blocked: ${url}`, type, categories)
        }
    }
}
function reconsentPreference(agreedCategories) {
    const cookieDetails = getCookieDetails(cookieName)
    processUserConsentBasedOnPreference(cookieDetails, agreedCategories, cookieName)
    processExistingElements()
    location.reload()
}
function setupPrivacyObserver() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Handle added nodes
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && monitoredElements.includes(node.tagName.toLowerCase())) {
                    handleTags(node)
                }
            })

            // Handle attribute changes
            if (
                mutation.type === 'attributes' &&
                (mutation.attributeName === 'src' || mutation.attributeName === 'type')
            ) {
                handleTags(mutation.target)
            }
        })
    })

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'type']
    })
}
function processExistingElements() {
    monitoredElements.forEach((tag) => {
        document.querySelectorAll(tag).forEach((element) => {
            handleTags(element)
        })
    })
}
function autoBlocking() {
    // Store original Element prototype methods
    const originalSetAttribute = Element.prototype.setAttribute
    // const originalSetAttributeNS = Element.prototype.setAttributeNS

    // Override setAttribute to catch dynamic changes
    Element.prototype.setAttribute = function (name, value) {
        if (name === 'src' && monitoredElements.includes(this.tagName.toLowerCase())) {
            const tagDetails = getUrlDetails(value)
            if (!hasUserConsent(tagDetails.categories)) {
                console.log(`Blocking src setting for ${this.tagName}:`, value)
                originalSetAttribute.call(this, 'data-src', value)
                if (this.tagName.toLowerCase() === 'script') {
                    originalSetAttribute.call(this, 'type', 'text/plain')
                }
                return
            }
        }
        originalSetAttribute.call(this, name, value)
    }

    // Add default styling for blocked elements
    const style = document.createElement('style')
    style.textContent = `
        iframe[data-src]:not([src]), 
        img[data-src]:not([src]), 
        embed[data-src]:not([src]) {
            display: block !important;
            background: #f0f0f0 !important;
            border: 1px solid #ccc !important;
            padding: 20px !important;
            text-align: center !important;
            min-height: 100px !important;
            position: relative !important;
        }
        
        iframe[data-src]:not([src])::before, 
        img[data-src]:not([src])::before,
        embed[data-src]:not([src])::before {
            content: "Content blocked pending consent" !important;
            display: block !important;
            color: #666 !important;
            font-family: sans-serif !important;
        }
    `
    document.head.appendChild(style)
    // Initialize when DOM is ready
    function initialize() {
        processExistingElements()
        setupPrivacyObserver()
        console.log('Privacy controls initialized')
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize)
    } else {
        initialize()
    }

    // Export consent update function to global scope
    window.updatePrivacyConsent = function (consentObject) {
        localStorage.setItem(cookieName, JSON.stringify(consentObject))
        processExistingElements()
    }
}
