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

export const styleTagHTML = {
    iabStyles: `
        .consent-tabs-privy-cmp-AE1VSVI8T5{
            padding: 7px 10px !important;
            border: 1px solid #B2B5B8 !important;
            border-radius: 8px !important;
            display:flex !important;
            justify-content: center !important;
            align-items: center !important;
            position: relative !important;
        }
        .consent-tabs-privy-cmp-AE1VSVI8T5 .consent-tabs-inside-privy-cmp-AE1VSVI8T5{
            width:  80% !important;
            display:flex !important;
            gap:1rem !important;
            justify-content:space-between !important;
            align-items:center !important;
        }
        .consent-tabs-privy-cmp-AE1VSVI8T5 .tab-privy-cmp-AE1VSVI8T5{
            color: #484E56 !important;
            font-size: 1rem !important;
            font-weight: normal !important;
            padding: 5px 25px !important;
            border-radius: 5px !important;
            margin: 0px !important;
            cursor: pointer;
        }
        .consent-tabs-privy-cmp-AE1VSVI8T5 .active-privy-cmp-AE1VSVI8T5{
            background-color: rgba(9, 11, 15, 0.08 ) !important;
            color: #000 !important;
        }
        .hide-privy-cmp-AE1VSVI8T5 {
            display: none !important;
        }
        .dropdown-title-privy-cmp-AE1VSVI8T5{
            display: flex !important;
            align-items: center !important;
            border: 1px solid #B2B5B8 !important;
            border-radius: 10px !important;
            padding: 10px !important;
            background-color: #FAFAFB !important;
            cursor: pointer !important;
            justify-content: space-between !important;
        }
        .dropdown-wrapper-privy-cmp-AE1VSVI8T5{
            background-color: #F3F3F4 !important;
            border-radius: 10px !important;
            margin-bottom: 10px !important;
            margin-top: 5px !important;
        }
        .dropdown-name-privy-cmp-AE1VSVI8T5{
            font-size: 14px !important;
            line-height: 1 !important;
            margin: 0px !important;
            padding: 0px !important;
            color: var(--privy-cmp-dropdown-heading-color) !important;
            display: inline !important;
            font-weight: var(--privy-cmp-dropdown-heading-font-weight) !important;
        }
        .iab-dropdown-content-privy-cmp-AE1VSVI8T5{
            padding: 20px !important;
            max-height: 170px !important;
            overflow: auto !important;
            font-size: 12px !important;
            color: #131A25 !important;
            line-height: 15px !important;
            margin: 0px !important;
        }

        #tab-content-privy-cmp-AE1VSVI8T5-privy-cmp-AE1VSVI8T5{
            color: black !important;
        }
        .sub-tab-privy-cmp-AE1VSVI8T5.sub-tab-purposes-privy-cmp-AE1VSVI8T5{
            display: flex !important;
            border-bottom: 3px solid rgb(231 232 233 / 50%) !important;
            background-color: white !important;
        }
        .sub-tab-privy-cmp-AE1VSVI8T5.sub-tab-purposes-privy-cmp-AE1VSVI8T5 .sub-tab-option-privy-cmp-AE1VSVI8T5{
            font-size: 14px !important;
            font-weight: 500 !important;
            color: #666666 !important;
            cursor: pointer !important;
            padding: 12px !important;
            margin-top: 0px !important;
            margin-bottom: 0px !important;
        }
        .sub-tab-privy-cmp-AE1VSVI8T5.sub-tab-purposes-privy-cmp-AE1VSVI8T5 .sub-tab-option-privy-cmp-AE1VSVI8T5.active-privy-cmp-AE1VSVI8T5{
            color: #1a4bb7 !important;
            font-weight: 600 !important;
            position: relative !important;
        }
        .sub-tab-privy-cmp-AE1VSVI8T5.sub-tab-purposes-privy-cmp-AE1VSVI8T5 .sub-tab-option-privy-cmp-AE1VSVI8T5.active-privy-cmp-AE1VSVI8T5::after {
            content: '' !important;
            position: absolute !important;
            left: 0 !important;
            bottom: -2px !important;
            height: 3px !important;
            width: 100% !important;
            background-color: #1a4bb7 !important;
        }
        .subtab-content-privy-cmp-AE1VSVI8T5{
            display: none !important;
        }
        .subtab-content-privy-cmp-AE1VSVI8T5.active-privy-cmp-AE1VSVI8T5{
            display: block !important;
        }
        .iab-bottom-panel-privy-cmp-AE1VSVI8T5{
            background-color: black !important;
            padding: 16px 24px !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: flex-start !important;
            gap: 10px !important;
        }
        .iab-bottom-panel-text-privy-cmp-AE1VSVI8T5{
            flex: 1 !important;
            color: white !important;
            font-size: 12px !important;
            font-weight: 600 !important;
            line-height: 140% !important;
        }

        .iab-bottom-panel-buttons-privy-cmp-AE1VSVI8T5{
            display: flex !important;
            gap: 8px !important;
            align-items: center !important;
        }

        .iab-bottom-panel-button-privy-cmp-AE1VSVI8T5 {
            padding: 8px 12px !important;
            background-color: white !important;
            border-radius: 8px !important;
            border: 1px solid var(--privy-cmp-primary-color) !important;
            color: var(--privy-cmp-primary-color) !important;
            font-weight: 600 !important;
            font-size: 14px !important;
            cursor: pointer !important;
        }

        .iab-type-title-privy-cmp-AE1VSVI8T5{
            font-size: 16px !important;
            font-weight: bold !important;
            margin: 1rem 0 0.3rem 0 !important;
            color: black !important;
        }

        .iab-type-desc-privy-cmp-AE1VSVI8T5{
            color: #808080 !important;
            font-size: 0.9rem !important;
        }
        .iab-illustrations-privy-cmp-AE1VSVI8T5{
            margin: 0.5rem 0 !important;
            padding-left: 40px !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 0.5rem !important;
        }
        .iab-vendors-privy-cmp-AE1VSVI8T5{
            display: flex !important;
            gap: 0.5rem !important;
            align-items: center !important;
            margin-top: 1rem !important;
            flex-wrap: wrap !important;
        }
        .iab-vendor-privy-cmp-AE1VSVI8T5{
            display: flex !important;
            background-color: #c4c7ca !important;
            padding: 0.2rem 0.8rem !important;
            border-radius: 8px !important;
        }
        .vendor-link-privy-cmp-AE1VSVI8T5 {
            font-size: 12px !important;
            margin-left:0.3rem !important;
            text-decoration: none !important;
            color: black !important;
        }
        .vendor-link-privy-cmp-AE1VSVI8T5:hover {
            color: black !important;
        }
        .vendor-privacy-policy-privy-cmp-AE1VSVI8T5{
            display: flex !important;
            gap: 1rem !important;
            align-items: center !important;
            margin-bottom: 0.3rem !important;
        }
        .vendor-purpose-headline-privy-cmp-AE1VSVI8T5{
            display: flex !important;
            justify-content: space-between !important;
        }
        .vendor-purposes-box-privy-cmp-AE1VSVI8T5 {
            margin-top: 10px !important;
            padding: 10px !important;
            border: 1px solid #ccc !important;
            border-radius: 6px !important;
            background-color: #f9f9f9 !important;
        }
        .vendor-purposes-section-privy-cmp-AE1VSVI8T5 {
            margin-bottom: 10px !important;
        }
        .vendor-data-categories-list-privy-cmp-AE1VSVI8T5{
            margin-left: 2rem !important;
        }
        .purpose-row-privy-cmp-AE1VSVI8T5 {
            display: flex !important;
            justify-content: space-between !important;
            margin: 4px 0 !important;
        }
        .retention-privy-cmp-AE1VSVI8T5 {
            color: #666 !important;
        }

        /* Cookie Details Table Styles */
        .cookie-details-section-privy-cmp-AE1VSVI8T5 {
            margin-top: 10px !important;
            margin-bottom: 10px !important;
        }
        
        .cookie-details-placeholder-privy-cmp-AE1VSVI8T5,
        .cookie-details-loading-privy-cmp-AE1VSVI8T5,
        .cookie-details-error-privy-cmp-AE1VSVI8T5 {
            font-size: 11px !important;
        }
        
        .cookie-details-info-privy-cmp-AE1VSVI8T5 {
            font-style: normal !important;
            color: #495057 !important;
        }
        
        .cookie-table-wrapper-privy-cmp-AE1VSVI8T5 {
            margin-top: 10px !important;
            overflow-x: auto !important;
        }
        
        .cookie-details-table-privy-cmp-AE1VSVI8T5 {
            width: 100% !important;
            border-collapse: collapse !important;
            font-size: 12px !important;
            background-color: white !important;
        }
        
        .cookie-table-header-privy-cmp-AE1VSVI8T5 {
            background-color: #f8f9fa !important;
            color: #131A25 !important;
            font-weight: 600 !important;
            padding: 8px 12px !important;
            text-align: left !important;
            border: 1px solid #dee2e6 !important;
            font-size: 11px !important;
        }
        
        .cookie-table-row-privy-cmp-AE1VSVI8T5:nth-child(even) {
            background-color: #f8f9fa !important;
        }
        
        .cookie-table-cell-privy-cmp-AE1VSVI8T5 {
            padding: 8px 12px !important;
            border: 1px solid #dee2e6 !important;
            vertical-align: top !important;
            color: #131A25 !important;
            font-size: 11px !important;
            line-height: 1.4 !important;
        }
        
        .cookie-purposes-container-privy-cmp-AE1VSVI8T5 {
            // max-width: 200px !important;
        }
        
        .cookie-purpose-privy-cmp-AE1VSVI8T5 {
            margin-bottom: 4px !important;
            line-height: 1.3 !important;
            font-size: 10px !important;
        }
        
        .cookie-purposes-toggle-privy-cmp-AE1VSVI8T5 {
            cursor: pointer !important;
            margin-top: 4px !important;
        }
        
        .cookie-toggle-text-privy-cmp-AE1VSVI8T5 {
            background-color: #e9ecef !important;
            color: #495057 !important;
            padding: 2px 6px !important;
            border-radius: 3px !important;
            font-size: 9px !important;
            font-weight: 600 !important;
            cursor: pointer !important;
            display: inline-block !important;
        }
        
        .cookie-toggle-text-privy-cmp-AE1VSVI8T5:hover {
            background-color: #dee2e6 !important;
        }
        
        .cookie-purposes-header-privy-cmp-AE1VSVI8T5 {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            gap: 6px !important;
        }
        .w-10-privy-cmp-AE1VSVI8T5{
            width: 10% !important;
        }
        .w-20-privy-cmp-AE1VSVI8T5{
            width: 20% !important;
        }
        .w-50-privy-cmp-AE1VSVI8T5{
            width: 50% !important;
        }
        
    `,
    otherStyles: `
        :root {
        --privy-cmp-primary-color:\${template.buttonColor};
        --privy-cmp-button-text-color:\${template.buttonTextColor};
        --privy-cmp-button-hover-color:\${template.hoverButtonColor};
        --privy-cmp-text-hover-color:\${template.hoverTextColor};
        --privy-cmp-font-name:\${template.fontName}, Plus-Jakarta-Sans, Sans-Serif;
        --privy-cmp-heading-color:\${template.headingColor};
        --privy-cmp-button-border-radius:\${template.buttonBorderRadius};
        --privy-cmp-button-font-weight:\${template.buttonFontWeight};
        --privy-cmp-dropdown-heading-color:\${template.dropDownHeadingColor};
        --privy-cmp-dropdown-heading-font-weight:\${template.dropDownHeadingFontWeight};
        --privy-cmp-link-color:\${template.linkColor};
        --privy-cmp-dropdown-content-font-size:\${template.dropDownContentFontSize};
        }

        .banner-container-privy-cmp-AE1VSVI8T5{
            margin: 5px;
        }
        
        @keyframes glideBanner {
            0% {
            transform: translateY(100%);
            }
            100% {
            transform: translateY(0%);
            }
        }
        .banner-home-privy-cmp-AE1VSVI8T5 {
            display:none;
        }
        .idfy-box-privy-cmp-AE1VSVI8T5 {
            display: flex;
            flex-direction:column;
            background-color: white;
            justify-content: \${horizontal};
            position: fixed;
            \${vertical}: 20px;
            \${leftRight}: 10px;
            width: 53%;
            max-width: 70em;
            border-radius: 10px;
            font-family: var(--privy-cmp-font-name) !important;
            -webkit-font-smoothing: antialiased;
            z-index: 2147483647 !important; 
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
            animation: glideBanner 1.5s ease-in-out forwards;
        }

        .idfy-banner-privy-cmp-AE1VSVI8T5 {
            display: flex;
            flex-direction:column;
            background-color: white;
            justify-content: flex-end;
            position: fixed;
            \${vertical}: 0px;
            right: 0px;
            left: 0px;
            width: 100%;
            border-radius: 10px;
            font-family: var(--privy-cmp-font-name) !important;
            -webkit-font-smoothing: antialiased;
            z-index: 2147483647 !important; 
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
            animation: glideBanner 1.5s ease-in-out forwards;
            max-height: 65%;
            overflow-y:auto;
        }

        .banner-content-privy-cmp-AE1VSVI8T5 {
            overflow-y:auto;
            padding: 20px !important;
            transition: 2s;
        }

        .banner-heading-privy-cmp-AE1VSVI8T5 {
            font-size: 18px !important;
            margin: 0px !important;
            font-weight:bold !important;
            line-height:1 !important;
            padding:0px !important;
            color:var(--privy-cmp-heading-color) !important;
            font-family: var(--privy-cmp-font-name) !important;
        }

        .banner-inner-privy-cmp-AE1VSVI8T5 {
            align-items: center !important;
        }

        .description-privy-cmp-AE1VSVI8T5 {
            font-size: 14px !important;
            color: #484E56;
            line-height: 1.3 !important;
            margin:14px 0px 14px 0px !important;
            padding:0px!important;
            color:#484E56 !important;
            font-family: var(--privy-cmp-font-name) !important;
        }
        .screen0-scroll-privy-cmp-AE1VSVI8T5{
            max-height: 11rem !important;
            overflow-y: auto !important;
        }

        .banner-desc-privy-cmp-AE1VSVI8T5{
            flex:7 !important;
            margin:10px 10px 10px 0px !important;
            font-weight:normal !important;
        }

        .banner-button-container-privy-cmp-AE1VSVI8T5,.box-button-container-privy-cmp-AE1VSVI8T5 {
            margin-top: 10px!important;
            display: flex !important;
            justify-content: flex-end !important;
            align-items: center !important;
            flex-wrap: wrap !important;
            column-gap: 16px !important;
            row-gap: 6px !important;
        }

        .banner-header-container-privy-cmp-AE1VSVI8T5 {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            margin-bottom: 10px !important;
        }

        .box-button-privy-cmp-AE1VSVI8T5,.banner-button-privy-cmp-AE1VSVI8T5{
            margin-right: 2.5px !important;
            color: var(--privy-cmp-primary-color) !important;
            padding: 9px 20px !important;
            border: 1px solid var(--privy-cmp-primary-color) !important;
            border-radius: var(--privy-cmp-button-border-radius) !important;
            background: white !important;
            display:inline-block !important;
            line-height: 1!important;
            font-weight: var(--privy-cmp-button-font-weight) !important;
            font-size: 12px !important;
            font-family: var(--privy-cmp-font-name) !important;
            -webkit-font-smoothing: antialiased;
            cursor: pointer !important;
        }

        #allow-btn-privy-cmp-AE1VSVI8T5 {
            background-color:var(--privy-cmp-primary-color) !important;
            color: var(--privy-cmp-button-text-color)!important;
            border: 1px solid var(--privy-cmp-primary-color)!important;
        }

        /* custmise banner screen css */
        #customize-screen-privy-cmp-AE1VSVI8T5 {
            display: none;
        }

        .customize-settings-screen-privy-cmp-AE1VSVI8T5 {
            width: 40%;
            min-width: 290px;
            max-width: 30% ;
            background-color: white;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
            position: fixed;
            z-index: 2147483647 !important;
            top: 0;
            font-family: var(--privy-cmp-font-name);
            -webkit-font-smoothing: antialiased;
            overflow: auto;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border-radius: 10px;
        }

        .left-privy-cmp-AE1VSVI8T5{
            left: 0;
            height: 100%;
        }

        .right-privy-cmp-AE1VSVI8T5{
            right: 0;
            height: 100%;
        }

        .centre-privy-cmp-AE1VSVI8T5{
            max-height: 65%;
            min-width: 56%;
            left: 22%;
            top: 15%;
        }

        .vendor-redirect-privy-cmp-AE1VSVI8T5{
            cursor: pointer !important;
            color: #646cff !important;
            font-weight: 500 !important;
            text-decoration: underline !important;
        }

        .content-privy-cmp-AE1VSVI8T5 {
            padding: 0px 15px 20px;
        }

        .close-btn-privy-cmp-AE1VSVI8T5 {
            display: flex;
            justify-content: space-between;
            border-bottom: 0.5px solid #B2B5B8;
            padding: 10px 20px; 
            position: sticky;
            top: 0;
            background-color: #fff;
            z-index:2147483647 !important;
            align-items:center;
        }

        .close-button-privy-cmp-AE1VSVI8T5 {
            color: #7D8187 !important;
            font-size: 20px !important;
            background-color: transparent !important;
            border: none !important;
            cursor: pointer;
            display:inline-block !important;
            padding: 0 !important;
        }

        .box-heading-privy-cmp-AE1VSVI8T5 {
            font-size: 18px !important;
            margin: 0px !important;
            color: var(--privy-cmp-heading-color) !important;
            font-weight:bold !important;
            line-height:1 !important;
            padding:0px !important;
            font-family: var(--privy-cmp-font-name) !important;
        }

        .box-description-privy-cmp-AE1VSVI8T5 {
            font-size: 14px !important;
            margin: 14px 0px!important;
            color: #484E56 !important;
            line-height: 1.35 !important;
            padding: 0px !important;
            font-family: var(--privy-cmp-font-name) !important;
        }

        .categories-privy-cmp-AE1VSVI8T5 {
            margin-top: 25px;
            display: flex;
            flex-direction: column;
        }

        .category-privy-cmp-AE1VSVI8T5 {
            margin-bottom: 10px;
        }

        .category-header-privy-cmp-AE1VSVI8T5 {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1px solid #B2B5B8;
            border-radius: 10px;
            padding: 10px;
            background-color: #FAFAFB;
        }

        .category-privy-cmp-AE1VSVI8T5 label {
            font-size: 14px !important;
            line-height:1 !important;
            margin: 0px !important;
            padding: 0px !important;
            color: var(--privy-cmp-dropdown-heading-color) !important;
            display: inline !important;
            font-weight: var(--privy-cmp-dropdown-heading-font-weight) !important;
            font-family: var(--privy-cmp-font-name) !important;
        }

        .toggle-switch-privy-cmp-AE1VSVI8T5 {
            display: none !important;
        }

        .toggle-label-privy-cmp-AE1VSVI8T5 {
            display: inline-block !important;
            width: 40px !important;
            height: 20px !important;
            background-color: #ccc;
            border-radius: 10px;
            position: relative !important;
            cursor: pointer;
        }

        .toggle-label-privy-cmp-AE1VSVI8T5::after {
            content: '';
            width: 18px;
            height: 18px;
            background-color: white;
            border-radius: 50%;
            position: absolute !important;
            top: 1px;
            left: 1px;
            transition: 0.3s;
        }

        .toggle-switch-privy-cmp-AE1VSVI8T5:checked+.toggle-label-privy-cmp-AE1VSVI8T5 {
            background-color: var(--privy-cmp-primary-color);
        }

        .toggle-switch-privy-cmp-AE1VSVI8T5:checked+.toggle-label-privy-cmp-AE1VSVI8T5::after {
            transform: translateX(20px);
        }

        .toggle-label-privy-cmp-AE1VSVI8T5.disabled-privy-cmp-AE1VSVI8T5 {
            background-color: #ccc; 
            opacity: 0.7; 
            cursor: not-allowed; 
        }

        .toggle-label-privy-cmp-AE1VSVI8T5.disabled-privy-cmp-AE1VSVI8T5::after {
            background-color: #fff; 
        }

        .dropdown-arrow-privy-cmp-AE1VSVI8T5 {
            margin-right: 10px !important;
            transform: scale(2.5, 2) translate(0, 2px);
            background-color: transparent !important;
            border: none !important;
            align-items: baseline;
            font-family: 'Courier New', Courier, monospace !important;
            transition: transform 0.3s ease !important;
            display:inline-block !important;
            line-height: 1!important;
            font-weight: 100!important;
            padding: 1px 6px !important;
            font-size:13.3px !important;
            color: #000000 !important;
        }

        .rotated-privy-cmp-AE1VSVI8T5 {
            transform: scale(2.5, 2) translate(0, -3px) rotate(180deg);
            transition: transform 0.3s ease;
        }

        .dropdown-content-privy-cmp-AE1VSVI8T5 {
            background-color: #F3F3F4;
            border-radius: 10px;
        }
            
        .dropdown-content-inside-privy-cmp-AE1VSVI8T5 {
            display: none;
            padding: 20px;
        }

        .category-description-privy-cmp-AE1VSVI8T5 {
            font-size: var(--privy-cmp-dropdown-content-font-size) !important;
            color: #131A25 !important;
            line-height: 15px !important;
            margin:0px !important;
            padding: 0px !important;
            font-family: var(--privy-cmp-font-name) !important;
            line-height: 1.2 !important;
        }

        .view-cookies-privy-cmp-AE1VSVI8T5 {
            font-size: 12px !important;
            font-family: var(--privy-cmp-font-name) !important;
            color: var(--privy-cmp-link-color) !important;
            margin-top: 10px !important;
            cursor: pointer;
            font-weight: bold !important;
        }

        .show-cookies-privy-cmp-AE1VSVI8T5 {
            max-height: 170px !important;
            overflow: auto !important;
        }

        .all-cookies-privy-cmp-AE1VSVI8T5 {
            display: none;
            background-color: #F3F3F4;
            box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
            border-radius: 0 0 10px 10px;
            padding: 2px 10px 9px 10px;
            color: #131A25;
            font-size: 11px;
        }

        .cookie-privy-cmp-AE1VSVI8T5 {
            font-size: 11px !important;
            background-color: #E2E2E2;
            padding: 8px 18px !important;
            margin-top: 6px !important;
            border-radius: 12px;
            overflow: auto;
        }

        .cookie-name-privy-cmp-AE1VSVI8T5,
        .platform-privy-cmp-AE1VSVI8T5 {
            margin: 2px 0px !important;
            font-size: 11px !important;
            line-height: 1 !important;
            color: #131A25 !important;
            padding: 0px !important;
            font-family: var(--privy-cmp-font-name) !important;
        }

        .cookie-name-privy-cmp-AE1VSVI8T5,
        .platform-privy-cmp-AE1VSVI8T5 span {
            font-family: var(--privy-cmp-font-name) !important;
        }

        .bottom-panel-privy-cmp-AE1VSVI8T5 {
            position: sticky;
            bottom: 0;
            width: 100%;
        }

        .preference-button-privy-cmp-AE1VSVI8T5 {
            border-top: 0.5px solid #B2B5B8;
            padding: 10px;
            text-align: center;
            background-color: #fff;
            display:flex;
            justify-content: space-around;
            flex-direction:row;
        }

        .preference-button-privy-cmp-AE1VSVI8T5 button {
            padding: 10px 18px !important;
            // width:45% !important;
            font-size: 12px !important;
            border-radius: var(--privy-cmp-button-border-radius) !important;
            margin: 3px !important;
            // display:inline-block !important;
            line-height: 1!important;
            font-weight: var(--privy-cmp-button-font-weight) !important;
            font-family: var(--privy-cmp-font-name) !important;
            -webkit-font-smoothing: antialiased;
        }

        .button1-privy-cmp-AE1VSVI8T5 {
            color: var(--privy-cmp-button-text-color) !important;
            border: 1px solid var(--privy-cmp-primary-color) !important;
            background-color: var(--privy-cmp-primary-color);
            transition: 0.3s;
            flex:1;
        }

        .button2-privy-cmp-AE1VSVI8T5 {
            color: var(--privy-cmp-primary-color) !important;
            border: 1px solid var(--privy-cmp-primary-color) !important;
            background-color: #fff;
            transition: 0.3s;
            flex:1;
        }

        .button2-privy-cmp-AE1VSVI8T5:hover,
        .button1-privy-cmp-AE1VSVI8T5:hover,
        .classic-button-privy-cmp-AE1VSVI8T5:hover,.banner-button-privy-cmp-AE1VSVI8T5:hover,.box-button-privy-cmp-AE1VSVI8T5:hover,#allow-btn-privy-cmp-AE1VSVI8T5:hover {
            background-color: var(--privy-cmp-button-hover-color) !important;
            color: var(--privy-cmp-text-hover-color) !important;
            transition: 0.3s;
            border: 1px solid var(--privy-cmp-button-hover-color) !important;
        }

        .language-logo-privy-cmp-AE1VSVI8T5 {
            padding: 5px !important;
            border-radius: 8px !important;
            border: 1px solid #131A254D !important;
            background-color: #fff !important;
            cursor: pointer !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            min-width: 30px !important;
            min-height: 30px !important;
            transition: 0.3s ease !important;
        }

        .language-logo-privy-cmp-AE1VSVI8T5:hover {
            background-color: #f5f5f5 !important;
            border-color: #131A25 !important;
        }

        .language-logo-privy-cmp-AE1VSVI8T5 svg {
            pointer-events: none !important;
        }

        .powered-privy-cmp-AE1VSVI8T5 {
            text-align: right;
            background-color: #F3F3F4;
            font-size: 12px !important;
            padding: 0px 10px !important;
            margin:0px !important;
            color: #7D8187 !important;
            font-weight:normal !important;
            line-height:1 !important;
            display: flex;
            align-items: center;
            justify-content: end;
            gap: 5px;
            }
        .powered-privy-cmp-AE1VSVI8T5-text{
            margin-bottom: 4px;
        }

        .powered-privy-cmp-AE1VSVI8T5 a {
            color: #1C43B9 !important;
            font-weight: bold !important;
            text-decoration:none !important;
            font-size: 10px!important;
            line-height:1 !important;
        } 

        @media (max-width: 900px) {
            .box-button-container-privy-cmp-AE1VSVI8T5{
                text-align: center!important;
            }
            .box-button-privy-cmp-AE1VSVI8T5 {
                width: 100%;
                height: 100%;
                font-size: 15px !important;
                padding: 13px 22px !important;
                display:block !important;
            }

            .banner-inner-privy-cmp-AE1VSVI8T5 {
                display: block !important;
                align-items: right !important;
            }
        }


        @media (max-width: 480px) {
            .idfy-banner-privy-cmp-AE1VSVI8T5,
            .idfy-box-privy-cmp-AE1VSVI8T5{
                left: 0;
                right: 0;
                \${template.positionMobile}: 0;
                \${template.positionMobile === 'top' ? 'bottom: auto;' : 'top: auto;'}
                width: 100%;
                max-height:80%;
                overflow:auto;
            }

            .banner-button-privy-cmp-AE1VSVI8T5{
                width: 100%;
                height: 100%;
                font-size: 15px !important;
                padding: 13px 22px !important;
                display:block !important;
            }

            .customize-settings-screen-privy-cmp-AE1VSVI8T5 {
                width:90vw;
                max-width:480px;
                padding:0;
                margin:0;
            }

            .preference-button-privy-cmp-AE1VSVI8T5 button{
                padding: 13px 22px !important;
                font-size: 15px !important;
            }

        }

        @media (max-width: 850px){
            .preference-button-privy-cmp-AE1VSVI8T5{
            flex-direction:column;
            }
        }

        @media (max-width: 660px) {
            .centre-privy-cmp-AE1VSVI8T5{
                min-width: 290px;
                max-height: 100%;
                height: 100%;
                left: 0;
                top: 0;
            }
        }

        .reconsent-button-privy-cmp-AE1VSVI8T5 {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: none !important;
            padding: 0 !important;
            margin: 0 !important;
            border-radius: 0 !important;
            cursor: pointer;
            display: none;
            z-index: 2147483648;
            border: none !important;
            outline: none !important;
            transition: background-color 0.3s ease, transform 0.3s ease !important;
        }

        .reconsent-button-privy-cmp-AE1VSVI8T5:hover {
            background: none !important;
            transform: scale(1.1);
            cursor: pointer !important;
        }
            .reconsent-button-privy-cmp-AE1VSVI8T5 svg,
        .reconsent-button-privy-cmp-AE1VSVI8T5 svg path {
            pointer-events: none;
        }

        /* Language Dropdown Styles */
        .language-dropdown-wrapper-privy-cmp-AE1VSVI8T5 {
            display: flex;
            align-items: center;
            margin-right: 10px;
        }

        .language-dropdown-container-privy-cmp-AE1VSVI8T5 {
            position: relative;
            display: inline-block;
        }

        .language-dropdown-button-privy-cmp-AE1VSVI8T5 {
            display: flex;
            align-items: center;
            gap: 8px;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            padding: 8px;
            cursor: pointer;
            font-size: 12px;
            color: #131A25;
            transition: all 0.2s ease;
            min-width: 80px;
        }

        .language-dropdown-button-privy-cmp-AE1VSVI8T5:hover {
            border-color: #214698;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .language-text-privy-cmp-AE1VSVI8T5 {
            font-weight: 500;
            white-space: nowrap;
        }

        .dropdown-arrow-privy-cmp-AE1VSVI8T5 {
            transition: transform 0.2s ease;
        }

        .language-dropdown-menu-privy-cmp-AE1VSVI8T5 {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            max-height: 250px;
            width: 200px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
            margin-top: 4px;
        }

        .language-dropdown-menu-privy-cmp-AE1VSVI8T5.show-privy-cmp-AE1VSVI8T5 {
            display: block;
        }

        .language-option-privy-cmp-AE1VSVI8T5 {
            padding: 10px 12px;
            cursor: pointer;
            font-size: 12px;
            color: #131A25;
            border-bottom: 1px solid #f0f0f0;
            transition: background-color 0.2s ease;
        }

        .language-option-privy-cmp-AE1VSVI8T5:last-child {
            border-bottom: none;
        }

        .language-option-privy-cmp-AE1VSVI8T5:hover {
            background-color: #f8f9fa;
        }

        .language-option-privy-cmp-AE1VSVI8T5.selected-privy-cmp-AE1VSVI8T5 {
            background-color: #e3f2fd;
            color: #1976d2;
            font-weight: 500;
        }

        /* Update close button container to accommodate language dropdown */
        .close-btn-privy-cmp-AE1VSVI8T5 {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px 20px;
            border-bottom: 1px solid #e0e0e0;
        }

        .close-btn-privy-cmp-AE1VSVI8T5 .box-heading-privy-cmp-AE1VSVI8T5 {
            margin: 0;
            flex: 1;
        }

        .close-btn-privy-cmp-AE1VSVI8T5 .close-button-privy-cmp-AE1VSVI8T5 {
            margin-left: 10px;
        }

        /* Banner header container styles */
        .banner-header-container-privy-cmp-AE1VSVI8T5 {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 15px;
        }

        .banner-header-container-privy-cmp-AE1VSVI8T5 .banner-heading-privy-cmp-AE1VSVI8T5 {
            margin: 0;
            flex: 1;
        }

        .language-logo-privy-cmp-AE1VSVI8T5 {
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
            border-radius: 6px;
            transition: background-color 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .language-logo-privy-cmp-AE1VSVI8T5:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }
        `
}
