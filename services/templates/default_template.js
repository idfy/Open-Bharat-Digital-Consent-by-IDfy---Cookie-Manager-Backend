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

export const DEFAULT_TEMPLATE = {
    bannerType: 'box',
    positionDesktop: 'bottom-right',
    positionMobile: 'bottom',
    buttonColor: '#214698',
    hoverButtonColor: '#214699',
    buttonTextColor: '#ffffff',
    hoverTextColor: '#ffffff',
    preferenceManagerHorizontalPosition: 'left',
    fontName: 'Plus Jakarta Sans',
    headingColor: '#000000',
    buttonBorderRadius: '8px',
    buttonFontWeight: 'Normal',
    linkColor: '#214698',
    dropDownHeadingColor: '#000000',
    dropDownHeadingFontWeight: 'Normal',
    dropDownContentFontSize: '12px',

    buttonsText: {
        acceptAll: 'Accept All',
        moreSettings: 'More Settings',
        savePreferences: 'Save My Preferences',
        allowNecessary: 'Reject All'
    },

    contentDesktop: {
        cookieBannerNotice:
            'Our site enables cookies that are able to read, store, and write information on your browser and in your device. The information processed by these cookies includes data relating to you which may include personal identifiers (e.g. IP address and session details) and browsing activity. We use this information for various purposes - e.g. to deliver content, maintain security, enable user choice, improve our sites, and for marketing purposes. You can reject all non-essential cookies. To personalize your choice go to preference manager for more settings.',
        preferenceManagerNotice: 
            'This website may request cookies to be set on your device. We use cookies to identify when you visit our sites, to understand your interactions, and to enhance and personalize your experience. Cookies also support social media features and tailor your engagement with our site, including delivering more relevant advertisements. You can review the different category headings to learn more and adjust your cookie preferences anytime. Please keep in mind that your choices may affect your experience on our site and the quality of services we can provide. Blocking certain types of cookies might affect the functionality and service offerings made available to you.'
    },
    // contentMobile: {
    //     cookieBannerNotice:
    //         'Our site enables cookies that are able to read, store, and write information on your browser and in your device. The information processed by these cookies includes data relating to you which may include personal identifiers (e.g. IP address and session details) and browsing activity. We use this information for various purposes - e.g. to deliver content, maintain security, enable user choice, improve our sites, and for marketing purposes. You can reject all non-essential cookies. To personalize your choice go to preference manager for more settings.',
    //     preferenceManagerNotice: 
    //         'This website may request cookies to be set on your device. We use cookies to identify when you visit our sites, to understand your interactions, and to enhance and personalize your experience. Cookies also support social media features and tailor your engagement with our site, including delivering more relevant advertisements. You can review the different category headings to learn more and adjust your cookie preferences anytime. Please keep in mind that your choices may affect your experience on our site and the quality of services we can provide. Blocking certain types of cookies might affect the functionality and service offerings made available to you.'
    // },
    initialNoticeHeader: 'Cookie Notice',
    preferenceNoticeHeader: 'Privacy Preference Center',
    cookieCategoryDescriptions: {
        necessary: 'Necessary cookies are crucial for the delivery of services, applications, or resources you request. They enable the website to function properly by managing actions such as loading necessary elements, accessing resources, or user sign-ins and sign-outs. Essential cookies also ensure the service\'s security and efficiency by enabling features like authentication and load balancing.',
        functional: 'Set by us or third-party providers, functional cookies add extra features and enhance our website\'s functionality not directly necessary for the service you\'ve requested. They enable convenience features such as pre-filled text fields, live chat support, and optional forms, improving your browsing experience with services like single sign-on (SSO).',
        marketing: 'Our advertising partners deploy these cookies to tailor advertising to your interests, based on your browsing behavior and preferences. They track your online activity to build a profile for customized advertising, ensuring the ads you encounter on other sites are aligned with your interests.',
        analytics: 'Analytics cookies are used to gather information on website usage, helping us understand visitor behavior. They track user interactions, providing insights that enable us to enhance the website\'s user experience and functionality. These cookies do not identify you personally but offer aggregated data to improve site performance.'
    }
}
