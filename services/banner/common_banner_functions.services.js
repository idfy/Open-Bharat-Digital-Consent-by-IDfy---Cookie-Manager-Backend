/* global DEFAULT_COOKIE_CONSENT  cookieName languagesMap createBanner, categorizedCookies, template,*/

// eslint-disable-next-line no-unused-vars
function toggleBanner(action) {
    const bannerHome = document.getElementById('banner-home-privy-cmp-AE1VSVI8T5')
    const customizeScreen = document.getElementById('customize-screen-privy-cmp-AE1VSVI8T5')
    const reconsentButton = document.getElementById('preference-privy-cmp-AE1VSVI8T5')
    if (action === 'show') {
        if (bannerHome) {
            bannerHome.style.display = ''
        }
        if (customizeScreen) {
            customizeScreen.style.display = 'none'
        }
        if (reconsentButton) {
            reconsentButton.style.display = 'none'
        }
    } else if (action === 'hide') {
        if (bannerHome) {
            bannerHome.style.display = 'none'
        }
        if (customizeScreen) {
            customizeScreen.style.display = 'none'
        }
        if (reconsentButton) {
            reconsentButton.style.display = 'block'
        }
    } else if (action === 'preference') {
        if (bannerHome) {
            bannerHome.style.display = 'none'
        }
        if (customizeScreen) {
            customizeScreen.style.display = 'block'
        }
        if (reconsentButton) {
            reconsentButton.style.display = 'none'
        }
    }
}

// eslint-disable-next-line no-unused-vars
function getPrivyDataPrincipalId() {
    let privyDataPrincipalId = localStorage.getItem('privyDataPrincipalId')
    if (!privyDataPrincipalId) {
        privyDataPrincipalId = crypto.randomUUID()
        localStorage.setItem('privyDataPrincipalId', privyDataPrincipalId)
    }
    return privyDataPrincipalId
}

// eslint-disable-next-line no-unused-vars
function getSessionId() {
    let sessionId = sessionStorage.getItem('privySessionId')
    if (!sessionId) {
        sessionId = crypto.randomUUID() // Generate a new session ID
        sessionStorage.setItem('privySessionId', sessionId)
    }
    return sessionId
}

// eslint-disable-next-line no-unused-vars
function setCookieOnBrowser(cookieConsent, cookieName, COOKIE_LIFETIME_DAYS) {
    console.log('setCookieOnBrowser', cookieConsent)
    const consentValue = typeof cookieConsent === 'string' ? cookieConsent : JSON.stringify(cookieConsent)
    const expires = new Date(Date.now() + COOKIE_LIFETIME_DAYS * 24 * 60 * 60 * 1000).toUTCString()
    document.cookie = `${cookieName}=${consentValue}; path=/; expires=${expires}`
    localStorage.setItem(cookieName, consentValue)
}

// eslint-disable-next-line no-unused-vars
function getConsentedBannerId() {
    const bannerId = localStorage.getItem('privyConsentedBannerId')
    return bannerId
}

function getReconsentLogo(width = 50, height = 50) {
    return `<svg width="${width}" height="${height}" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="50" height="50" rx="25" fill="var(--privy-cmp-primary-color)"/>
    <path d="M25 39C23.0633 39 21.2433 38.633 19.54 37.8989C17.8367 37.1648 16.355 36.1685 15.095 34.9101C13.835 33.6517 12.8375 32.1719 12.1025 30.4707C11.3675 28.7695 11 26.9517 11 25.0175C11 23.2697 11.3383 21.5568 12.015 19.8789C12.6917 18.201 13.6367 16.7037 14.85 15.387C16.0633 14.0703 17.5217 13.01 19.225 12.206C20.9283 11.402 22.795 11 24.825 11C25.315 11 25.8167 11.0233 26.33 11.0699C26.8433 11.1165 27.3683 11.1981 27.905 11.3146C27.695 12.3633 27.765 13.3537 28.115 14.2859C28.465 15.2181 28.99 15.9929 29.69 16.6105C30.39 17.228 31.2242 17.6534 32.1925 17.8864C33.1608 18.1194 34.1583 18.0612 35.185 17.7116C34.5783 19.0866 34.6658 20.4032 35.4475 21.6617C36.2292 22.9201 37.39 23.5726 38.93 23.6192C38.9533 23.8756 38.9708 24.1144 38.9825 24.3358C38.9942 24.5572 39 24.7961 39 25.0524C39 26.9634 38.6325 28.7636 37.8975 30.4532C37.1625 32.1427 36.165 33.6226 34.905 34.8926C33.645 36.1627 32.1633 37.1648 30.46 37.8989C28.7567 38.633 26.9367 39 25 39ZM22.9 22.221C23.4833 22.221 23.9792 22.0171 24.3875 21.6092C24.7958 21.2014 25 20.7062 25 20.1236C25 19.541 24.7958 19.0458 24.3875 18.638C23.9792 18.2301 23.4833 18.0262 22.9 18.0262C22.3167 18.0262 21.8208 18.2301 21.4125 18.638C21.0042 19.0458 20.8 19.541 20.8 20.1236C20.8 20.7062 21.0042 21.2014 21.4125 21.6092C21.8208 22.0171 22.3167 22.221 22.9 22.221ZM20.1 29.2122C20.6833 29.2122 21.1792 29.0083 21.5875 28.6005C21.9958 28.1927 22.2 27.6975 22.2 27.1149C22.2 26.5323 21.9958 26.037 21.5875 25.6292C21.1792 25.2214 20.6833 25.0175 20.1 25.0175C19.5167 25.0175 19.0208 25.2214 18.6125 25.6292C18.2042 26.037 18 26.5323 18 27.1149C18 27.6975 18.2042 28.1927 18.6125 28.6005C19.0208 29.0083 19.5167 29.2122 20.1 29.2122ZM29.2 30.6105C29.5967 30.6105 29.9292 30.4765 30.1975 30.2085C30.4658 29.9405 30.6 29.6084 30.6 29.2122C30.6 28.8161 30.4658 28.484 30.1975 28.216C29.9292 27.948 29.5967 27.814 29.2 27.814C28.8033 27.814 28.4708 27.948 28.2025 28.216C27.9342 28.484 27.8 28.8161 27.8 29.2122C27.8 29.6084 27.9342 29.9405 28.2025 30.2085C28.4708 30.4765 28.8033 30.6105 29.2 30.6105ZM25 36.2035C27.8467 36.2035 30.3725 35.2247 32.5775 33.2672C34.7825 31.3096 35.99 28.8161 36.2 25.7865C35.0333 25.2738 34.1175 24.5747 33.4525 23.6891C32.7875 22.8036 32.3383 21.8132 32.105 20.7179C30.3083 20.4615 28.7683 19.6925 27.485 18.4107C26.2017 17.129 25.4083 15.5909 25.105 13.7965C23.2383 13.7499 21.5992 14.0878 20.1875 14.8102C18.7758 15.5327 17.5975 16.459 16.6525 17.5893C15.7075 18.7195 14.9958 19.9488 14.5175 21.2772C14.0392 22.6055 13.8 23.8523 13.8 25.0175C13.8 28.1169 14.8908 30.7561 17.0725 32.9351C19.2542 35.114 21.8967 36.2035 25 36.2035Z" fill="var(--privy-cmp-button-text-color)"/>
    </svg>`
}

// eslint-disable-next-line no-unused-vars
function addReconsentButton() {
    const preferenceButton = document.createElement('button')
    preferenceButton.id = 'preference-privy-cmp-AE1VSVI8T5'
    preferenceButton.className = 'reconsent-button-privy-cmp-AE1VSVI8T5'
    preferenceButton.innerHTML =
        getReconsentLogo()
    document.body.appendChild(preferenceButton)
}
// eslint-disable-next-line no-unused-vars
function setConsentedBannerId(bannerId) {
    localStorage.setItem('privyConsentedBannerId', bannerId)
}
// eslint-disable-next-line no-unused-vars
function parsedConsentData(source) {
    try {
        if (typeof source === 'string') {
            return JSON.parse(source)
        }
        if (typeof source === 'object') {
            return source
        }
        return null
    } catch (error) {
        console.error('Error parsing consent data:', error)
        return null
    }
}
// eslint-disable-next-line no-unused-vars
function getCookieDetails(cookieName, defaultConsent = DEFAULT_COOKIE_CONSENT) {
    const cookieValue = document.cookie.split('; ').find((row) => row.startsWith(`${cookieName}=`))
    if (cookieValue) {
        const cookie = cookieValue.split('=')
        return cookie[1]
    }
    const localStorageValue = localStorage.getItem(cookieName)
    if (localStorageValue) {
        return localStorageValue
    }
    console.log('No cookie found on browser defaultConsent set')
    return defaultConsent
}
// eslint-disable-next-line no-unused-vars
function toggleConsentUIState() {
    const closeButton = document.querySelector('.close-button-privy-cmp-AE1VSVI8T5')
    const customizeButton = document.getElementById('customize-btn-privy-cmp-AE1VSVI8T5')

    closeButton.addEventListener('click', function () {
        const cookieString = getCookieDetails(cookieName)
        const parsed = parsedConsentData(cookieString)

        const consentGiven = parsed
            ? parsed?.update === true
            : (typeof cookieString === 'string' && cookieString.length > 0)

        toggleBanner(consentGiven ? 'hide' : 'show')
    })

    customizeButton.addEventListener('click', function () {
        toggleBanner('preference')
    })
}

function createLanguageDropdown(languageEnum) {
    const container = document.createElement('div')
    const showLanguageButton = Object.keys(languagesMap).length > 1
    container.className = 'language-dropdown-container-privy-cmp-AE1VSVI8T5'
    container.innerHTML = `
                    ${showLanguageButton ? `
                    <button onclick="toggleLanguageDropdown()" class="language-dropdown-button-privy-cmp-AE1VSVI8T5">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.792 13.3996C10.9217 13.0661 10.8383 12.6863 10.5789 12.4269L8.64287 10.5186L8.67066 10.4908C10.2825 8.6937 11.4312 6.62793 12.1074 4.44174H13.9046C14.4048 4.44174 14.8216 4.02488 14.8216 3.52465V3.50612C14.8216 3.00589 14.4048 2.58903 13.9046 2.58903H8.33717V1.66268C8.33717 1.15319 7.92031 0.736328 7.41082 0.736328C6.90133 0.736328 6.48447 1.15319 6.48447 1.66268V2.58903H0.917089C0.416859 2.58903 0 3.00589 0 3.50612C0 4.01562 0.416859 4.42321 0.917089 4.42321H10.3474C9.7267 6.22034 8.74477 7.91556 7.41082 9.39772C6.66047 8.57327 6.03055 7.67471 5.50253 6.72983C5.35432 6.46119 5.08567 6.29444 4.77998 6.29444C4.1408 6.29444 3.7332 6.98921 4.04816 7.54502C4.63176 8.5918 5.34505 9.59226 6.17877 10.5186L2.13061 14.5112C1.76007 14.8725 1.76007 15.4653 2.13061 15.8266C2.49189 16.1879 3.07549 16.1879 3.44603 15.8266L7.41082 11.8526L9.28205 13.7238C9.75449 14.1962 10.5604 14.0202 10.792 13.3996ZM15.2848 8.14715C14.729 8.14715 14.2288 8.4899 14.0342 9.01792L10.6345 18.0962C10.4122 18.6612 10.8383 19.2634 11.4405 19.2634C11.8017 19.2634 12.126 19.0411 12.2556 18.6983L13.0801 16.4843H17.4803L18.314 18.6983C18.4437 19.0318 18.7679 19.2634 19.1292 19.2634C19.7313 19.2634 20.1574 18.6612 19.9444 18.0962L16.5447 9.01792C16.3409 8.4899 15.8406 8.14715 15.2848 8.14715ZM13.7841 14.6316L15.2848 10.6205L16.7855 14.6316H13.7841Z" fill="#131A25"/>
                        </svg>
                        <span class="language-text-privy-cmp-AE1VSVI8T5">${languageEnum.toUpperCase()}</span>
                        <svg class="" width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.599982 0.724799C0.861954 0.462827 1.28669 0.462827 1.54867 0.724799L4.05575 3.23188L6.56283 0.724799C6.8248 0.462827 7.24954 0.462827 7.51151 0.724799C7.77349 0.986771 7.77349 1.41151 7.51151 1.67348L4.53009 4.65491C4.26812 4.91688 3.84338 4.91688 3.58141 4.65491L0.599982 1.67348C0.33801 1.41151 0.33801 0.986771 0.599982 0.724799Z" fill="#131A25"/>
                        </svg>
                    </button>
                    ` : ''}
            <div id="language-dropdown-menu-privy-cmp-AE1VSVI8T5" class="language-dropdown-menu-privy-cmp-AE1VSVI8T5">
                ${Object.entries(languagesMap).map(([code, name]) => `
            <div onclick="selectLanguage('${code}')" data-language="${code}" class="language-option-privy-cmp-AE1VSVI8T5 ${code === languageEnum ? 'selected-privy-cmp-AE1VSVI8T5' : ''}">
                ${name}
            </div>`).join('')}
            </div>
        `
    return container
}

function toggleLanguageDropdown() {
    const dropdown = document.getElementById('language-dropdown-menu-privy-cmp-AE1VSVI8T5')
    const arrow = document.querySelector('.language-dropdown-button-privy-cmp-AE1VSVI8T5 svg:last-child')
    if (dropdown) {
        dropdown.classList.toggle('show-privy-cmp-AE1VSVI8T5')
        if (arrow) {
            arrow.style.transform = dropdown.classList.contains('show-privy-cmp-AE1VSVI8T5')
                ? 'rotate(180deg)'
                : 'rotate(0deg)'
        }
    }
}

// eslint-disable-next-line no-unused-vars
function selectLanguage(languageCode) {
    const button = document.querySelector('.language-dropdown-button-privy-cmp-AE1VSVI8T5')
    const languageText = button.querySelector('.language-text-privy-cmp-AE1VSVI8T5')

    if (languageText) {
        languageText.textContent = languageCode.toUpperCase()
    }

    document.querySelectorAll('.language-option-privy-cmp-AE1VSVI8T5').forEach((option) => {
        option.classList.remove('selected-privy-cmp-AE1VSVI8T5')
    })

    const selectedOption = document.querySelector(`[data-language="' + ${languageCode} + '"]`)
    if (selectedOption) {
        selectedOption.classList.add('selected-privy-cmp-AE1VSVI8T5')
    }
    changeLanguage(languageCode)
    toggleLanguageDropdown()
}

function changeLanguage(languageEnum) {
    const bannerContainer = document.querySelector('.banner-container-privy-cmp-AE1VSVI8T5')
    if (bannerContainer) {
        const newBannerHTML = createBanner(categorizedCookies, template, languageEnum)
        bannerContainer.innerHTML = newBannerHTML
        toggleConsentUIState()
        const consentCookie = parsedConsentData(getCookieDetails(cookieName))
        if (consentCookie.update === true) {
            toggleBanner('hide')
        } else {
            toggleBanner('show')
        }

        // Re-initialize the language dropdown functionality
        const wrapper = document.getElementById('language-dropdown-wrapper-id-privy-cmp-AE1VSVI8T5')
        if (wrapper) {
            wrapper.innerHTML = '' // Clear previous dropdown if any
            wrapper.appendChild(createLanguageDropdown(languageEnum))
        }
    }
}
