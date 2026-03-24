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

import { generalBannerContent, nonIabBottomPanel } from './banner_elements.services.js'
import { styleTagHTML } from './styles.js'

export function bannerPreferenceScreen() {
    const content = generalBannerContent
    const bottomPanel = nonIabBottomPanel

    const bannerPreferenceScreen = `<div id="customize-screen-privy-cmp-AE1VSVI8T5">
            <div class="customize-settings-screen-privy-cmp-AE1VSVI8T5 \${template.preferenceManagerHorizontalPosition}-privy-cmp-AE1VSVI8T5">
                <div>
                    <div class="close-btn-privy-cmp-AE1VSVI8T5">
                        <h2 class="box-heading-privy-cmp-AE1VSVI8T5">\${template.text[languageEnum].preferenceNoticeHeader}</h2>
                        <div class="language-dropdown-wrapper-privy-cmp-AE1VSVI8T5" id="language-dropdown-wrapper-id-privy-cmp-AE1VSVI8T5" >
                        </div>
                        <div class="close-button-privy-cmp-AE1VSVI8T5">×</div>
                    </div>
                    ${content}
                </div>
    
                <div class="bottom-panel-privy-cmp-AE1VSVI8T5">
                    ${bottomPanel}
                </div>
            </div>
        </div>`
    return bannerPreferenceScreen
}

export function bannerSkeleton(bannerId) {
    const code = `
    function showBanner(languageEnum){   
        let consentCookie = parsedConsentData(getCookieDetails(cookieName))
        const consentedBannerId = getConsentedBannerId()
        addReconsentButton()
        if (typeof consentCookie?.update !== 'boolean' || consentedBannerId !== \`${bannerId}\`){
        consentCookie.update = false;
        setConsentedBannerId(\`${bannerId}\`)
        setCookieOnBrowser(consentCookie, cookieName, COOKIE_LIFETIME_DAYS)
        location.reload()
    }
    consentCookie = parsedConsentData(getCookieDetails(cookieName));
    const consentButtonDiv = document.createElement('div')
    consentButtonDiv.className = 'consent-button-privy-cmp-AE1VSVI8T5'
    document.body.appendChild(consentButtonDiv)
    const banner = createBanner(categorizedCookies, template, languageEnum)
    const bannerContainer = document.createElement('div')
    bannerContainer.className = 'banner-container-privy-cmp-AE1VSVI8T5'
    bannerContainer.innerHTML = banner
    document.body.appendChild(bannerContainer)

    let horizontal = 'flex-end'
    let leftRight = 'right'
    let vertical = 'bottom'

    if (template.positionDesktop.includes('left')) {
        horizontal = 'flex-start'
        leftRight = 'left'
    }
    if (template.positionDesktop.includes('top')) {
        vertical = 'top'
    }

    const styleTag = document.createElement('style')
    styleTag.innerHTML = \`${styleTagHTML.otherStyles}\`
    document.head.appendChild(styleTag)

    const scriptTag = document.createElement('script')
    scriptTag.innerHTML = \`${cookieBannerScriptTagHTML()}\`
    document.head.appendChild(scriptTag)
    const wrapper = document.getElementById("language-dropdown-wrapper-id-privy-cmp-AE1VSVI8T5");
    wrapper.appendChild(createLanguageDropdown(languageEnum)); 
    setupBannerBasedOnConsentGeneral(consentCookie, \`${bannerId}\`)
        }
        document.addEventListener('click', function(event) {
            const dropdown = document.getElementById('language-dropdown-menu-privy-cmp-AE1VSVI8T5')
            const button = document.querySelector('.language-dropdown-button-privy-cmp-AE1VSVI8T5')
            
            if (dropdown && button && !button.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.classList.remove('show-privy-cmp-AE1VSVI8T5')
            }
        })        
        document.addEventListener("DOMContentLoaded", () => showBanner("en"));
        document.addEventListener("click", function (event) {
            if (event.target.id === "customize-btn-privy-cmp-AE1VSVI8T5") {
                sendEventDetails(\`${bannerId}\`, 'CustomizeCookiesView');
            }

            if (event.target.id === "preference-privy-cmp-AE1VSVI8T5") {
                toggleBanner('preference')
                sendEventDetails(\`${bannerId}\`, 'PreferenceCenter');
            }
})`
    return code
}

function cookieBannerScriptTagHTML() {
    const html = 'toggleConsentUIState();'
    return html
}
