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

import { getLanguageLogo, getPrivyLogoSvg } from '../static/banner_svg.js'

export const generalBannerContent = `
    <div class="content-privy-cmp-AE1VSVI8T5">
        <p class="box-description-privy-cmp-AE1VSVI8T5">\${template.text[languageEnum].contentDesktop.preferenceManagerNotice}</p>
        <div class="categories-privy-cmp-AE1VSVI8T5">
        \${Object.keys(categorizedCookies).map(category => {
            const consentCookie = parsedConsentData(getCookieDetails(cookieName));
            const isAgreedCategory = consentCookie[category];
            const cookieData = categorizedCookies[category];
            const isNecessary = category === 'NECESSARY';
            const isDisabled = isNecessary ? 'disabled' : '';
            const disabledClass = isDisabled ? 'disabled-privy-cmp-AE1VSVI8T5' : '';
            return \`
            <div class="category-privy-cmp-AE1VSVI8T5">
                <div class="dropdown-content-privy-cmp-AE1VSVI8T5">
                    <div class="category-header-privy-cmp-AE1VSVI8T5">
                        <div onclick="showDropdown('\${category}')" style="cursor:pointer">
                            <div class="dropdown-arrow-privy-cmp-AE1VSVI8T5 rotated-privy-cmp-AE1VSVI8T5 dropdown-arrow-\${category}-privy-cmp-AE1VSVI8T5">^</div>
                            <label for="\${category}">\${template.text[languageEnum]['static'][category]+' '+ template.text[languageEnum]['static']['Cookies']} </label>
                        </div>
                        <input type="checkbox" id="\${category}-toggle-privy-cmp-AE1VSVI8T5" class="toggle-switch-privy-cmp-AE1VSVI8T5" \${isAgreedCategory ? 'checked ' : ''} \${isDisabled}>
                        <label for="\${category}-toggle-privy-cmp-AE1VSVI8T5" class="toggle-label-privy-cmp-AE1VSVI8T5 \${disabledClass}"></label>
                    </div>
                    <div id="dropdown-\${category}-privy-cmp-AE1VSVI8T5" class="dropdown-content-inside-privy-cmp-AE1VSVI8T5">
                        <div class="category-description-privy-cmp-AE1VSVI8T5">
                            \${template.text[languageEnum]
                                .cookieCategoryDescriptions[
                                category.toLowerCase()
                            ]}
                        </div>
                        <div onclick="viewCookieDetails('\${category}')" id="view-cookies-\${category}" class="view-cookies-privy-cmp-AE1VSVI8T5">\${template.text[languageEnum]['static']['View Cookies']}</div>
                    </div>
                    <div class="show-cookies-privy-cmp-AE1VSVI8T5 show-cookies-privy-cmp-AE1VSVI8T5-\${category}">
                        <div id="all-cookies-privy-cmp-AE1VSVI8T5-\${category}" class="all-cookies-privy-cmp-AE1VSVI8T5">
                            \${cookieData.map(cookie => \`
                            <div class="cookie-privy-cmp-AE1VSVI8T5">
                                <p class="cookie-name-privy-cmp-AE1VSVI8T5"><span> \${template.text[languageEnum]['static']['Name']} </span>: \${cookie.cookie_master_name}</p>
                                <p class="platform-privy-cmp-AE1VSVI8T5"><span>\${template.text[languageEnum]['static']['Host']} </span>: \${cookie.cookie_domain}</p>
                            </div>
                            \`).join('')}
                        </div>
                    </div>
                </div>
            </div>
            \`;
        }).join('')}
        </div>
    </div>
`
export const nonIabBottomPanel = `
    <div class="preference-button-privy-cmp-AE1VSVI8T5">
        <button onclick="submitConsent('preference')" class="button1-privy-cmp-AE1VSVI8T5">\${template.text[languageEnum].buttonsText.savePreferences}</button>
        <button onclick="submitConsent('necessary')" class="button2-privy-cmp-AE1VSVI8T5">\${template.text[languageEnum].buttonsText.allowNecessary}</button>
    </div>
    <div class="powered-privy-cmp-AE1VSVI8T5">
        <div class="powered-privy-cmp-AE1VSVI8T5-text">Powered by </div> 
        <span><a href="https://www.privybyidfy.com/" target="_blank">${getPrivyLogoSvg()}</a></span>
    </div>
`
export function bannerInitialScreen0(languagesMap, cookiePolicy) {
    const showLanguageButton = Object.keys(languagesMap).length > 1
    return `
    <div class="idfy-\${template.bannerType}-privy-cmp-AE1VSVI8T5" id="banner-home-privy-cmp-AE1VSVI8T5">
        <div class="banner-content-privy-cmp-AE1VSVI8T5">
            <div class="banner-header-container-privy-cmp-AE1VSVI8T5">
                <h2 class="banner-heading-privy-cmp-AE1VSVI8T5">\${template.text[languageEnum].initialNoticeHeader}</h2>
                ${showLanguageButton ? `
                <button onclick="toggleBanner('preference')" class="language-logo-privy-cmp-AE1VSVI8T5">
                    ${getLanguageLogo()}
                </button>
                ` : ''}
            </div>
            <div class="\${template.bannerType}-inner-privy-cmp-AE1VSVI8T5">
                <p class="description-privy-cmp-AE1VSVI8T5 \${template.bannerType}-desc-privy-cmp-AE1VSVI8T5" >\${template.text[languageEnum].contentDesktop.cookieBannerNotice} 
                ${cookiePolicy && cookiePolicy.trim() !== '' ? `<a href="${cookiePolicy}" target="_blank" rel="noopener noreferrer">Cookie Policy</a>` : ''}
            </p>
                <div class="\${template.bannerType}-button-container-privy-cmp-AE1VSVI8T5">
                    <button onclick="submitConsentHandler('all')" id="allow-btn-privy-cmp-AE1VSVI8T5" class="\${template.bannerType}-button-privy-cmp-AE1VSVI8T5">\${template.text[languageEnum].buttonsText.acceptAll}</button>
                    <button onclick="submitConsentHandler('necessary')" class="\${template.bannerType}-button-privy-cmp-AE1VSVI8T5">\${template.text[languageEnum].buttonsText.allowNecessary}</button>
                    <button id="customize-btn-privy-cmp-AE1VSVI8T5" class="\${template.bannerType}-button-privy-cmp-AE1VSVI8T5">\${template.text[languageEnum].buttonsText.moreSettings}</button>
                </div>
            </div>
        </div>
        <div class="powered-privy-cmp-AE1VSVI8T5" style="border-radius:0px 0px 10px 10px;">
            <div class="powered-privy-cmp-AE1VSVI8T5-text">Powered by </div> 
            <span><a href="https://www.privybyidfy.com/" target="_blank">${getPrivyLogoSvg()}</a></span>
        </div>
    </div>
    `
}
