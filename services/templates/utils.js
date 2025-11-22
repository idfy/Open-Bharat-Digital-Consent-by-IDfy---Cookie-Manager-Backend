import { UnexpectedError } from '../custom_error.js'
import { v4 as uuidv4 } from 'uuid'
import { STATIC_BANNER_TEXT_TRANSLATIONS } from '../language_translation/constants.js'
/**
 * Mapping of database attributes to their corresponding UI paths.
 *
 * This object defines how template text fields stored in the database
 * map to structured UI configuration paths. Each DB attribute corresponds
 * to a nested property in the UI config object.
 *
 * Example:
 *  DB field: "accept_all_button_text"
 *  UI path:  "buttonsText.acceptAll"
 */
const DB_TO_UI_MAP = {
    accept_all_button_text: 'buttonsText.acceptAll',
    more_settings_button_text: 'buttonsText.moreSettings',
    save_preferences_button_text: 'buttonsText.savePreferences',
    allow_necessary_button_text: 'buttonsText.allowNecessary',
    cookie_banner_notice: 'contentDesktop.cookieBannerNotice',
    reference_manager_notice: 'contentDesktop.preferenceManagerNotice',
    initial_notice_header: 'initialNoticeHeader',
    preference_notice_header: 'preferenceNoticeHeader',
    necessary_category_description: 'cookieCategoryDescriptions.necessary',
    functional_category_description: 'cookieCategoryDescriptions.functional',
    analytics_category_description: 'cookieCategoryDescriptions.analytics',
    marketing_category_description: 'cookieCategoryDescriptions.marketing'
}

/**
 * Generates the reverse mapping of {@link DB_TO_UI_MAP}.
 *
 * Converts a DB → UI mapping into a UI → DB mapping so that
 * structured UI configs can be transformed back into flat DB records.
 *
 * @returns {Object.<string, string>} - An object where keys are UI paths and values are DB attributes.
 *
 * Example:
 * {
 *   "buttonsText.acceptAll": "accept_all_button_text"
 * }
 */
function generateUIToDBMap() {
    const UI_TO_DB_MAP = Object.fromEntries(Object.entries(DB_TO_UI_MAP).map(([dbAttr, uiPath]) => [uiPath, dbAttr]))
    return UI_TO_DB_MAP
}

/**
 * Extracts non-text configuration and text configuration entries
 * from a UI template input object.
 *
 * Splits the input into:
 *  1. `nonTextConfig`: Visual and layout settings for the UI.
 *  2. `textEntries`: Text attributes mapped back to DB-style records.
 *
 * Behavior:
 * - On every English (`language === 'en'`) save, a new `translation_uuid`
 *   is generated. This acts as a **reference version ID** for that set
 *   of template texts.
 * - All other languages will inherit the most recent `translation_uuid`
 *   from English and do not generate one themselves.
 *
 * @param {Object} input - Full template configuration object containing both text and non-text values.
 * @param {string} language - The language of the template these text entries belong to.
 *
 * @returns {{
 *   nonTextConfig: Object,
 *   textEntries: Array<{
 *     attribute: string,
 *     value: any,
 *     language: string,
 *     translation_uuid?: string
 *   }>
 * }}
 *
 * @example
 * const { nonTextConfig, textEntries } = extractTemplateConfig(uiConfig, 1, 'en');
 *
 * // nonTextConfig:
 * {
 *   bannerType: 'box',
 *   positionDesktop: 'bottom-right',
 *   ...
 * }
 *
 * // textEntries (English):
 * [
 *   { attribute: 'accept_all_button_text', value: 'Accept All', language: 'en', translation_uuid: '550e8400-e29b-41d4-a716-446655440001' },
 *   { attribute: 'cookie_banner_notice', value: 'We use cookies...', language: 'en', translation_uuid: '550e8400-e29b-41d4-a716-446655440002' }
 * ]
 *
 * // textEntries (Spanish):
 * [
 *   { attribute: 'accept_all_button_text', value: 'Aceptar todo', language: 'es' },
 *   { attribute: 'cookie_banner_notice', value: 'Usamos cookies...', language: 'es' }
 * ]
 */
function extractTemplateConfig(input, language) {
    const nonTextConfig = {
        bannerType: input.bannerType,
        positionDesktop: input.positionDesktop,
        positionMobile: input.positionMobile,
        buttonColor: input.buttonColor,
        hoverButtonColor: input.hoverButtonColor,
        buttonTextColor: input.buttonTextColor,
        hoverTextColor: input.hoverTextColor,
        preferenceManagerHorizontalPosition: input.preferenceManagerHorizontalPosition,
        fontName: input.fontName,
        headingColor: input.headingColor,
        buttonBorderRadius: input.buttonBorderRadius,
        buttonFontWeight: input.buttonFontWeight,
        linkColor: input.linkColor,
        dropDownHeadingColor: input.dropDownHeadingColor,
        dropDownHeadingFontWeight: input.dropDownHeadingFontWeight,
        dropDownContentFontSize: input.dropDownContentFontSize
    }
    const textEntries = Object.entries(generateUIToDBMap()).map(([uiPath, dbAttr]) => {
        const translationUUID = language === 'en' ? uuidv4() : null
        const value = uiPath.split('.').reduce((acc, key) => acc?.[key], input)
        return { attribute: dbAttr, value, language, ...(translationUUID && { translation_uuid: translationUUID }) }
    })

    return { nonTextConfig, textEntries }
}

/**
 * Converts an array of template text entries into a structured UI configuration object.
 *
 * @param {Array<{ attribute: string, value: string }>} textEntries - Array of text entries from DB.
 * @returns {Object} - Structured UI config containing `buttonsText`, `contentDesktop`, `contentMobile`, and `cookieCategoryDescriptions`.
 *
 * @example
 * const textEntries = [
 *   { attribute: 'accept_all_button_text', value: 'Accept All' },
 *   { attribute: 'cookie_banner_notice', value: 'We use cookies' }
 * ]
 *
 * const uiConfig = templateTextEntriesToUIConfig(textEntries)
 *
 * // uiConfig:
 * {
 *   buttonsText: { acceptAll: 'Accept All' },
 *   contentDesktop: { cookieBannerNotice: 'We use cookies' },
 *   cookieCategoryDescriptions: {}
 * }
 */
function templateTextDictToUIConfig(entries) {
    const uiConfig = {
        buttonsText: {},
        contentDesktop: {},
        // contentMobile: {},
        cookieCategoryDescriptions: {}
    }
    for (const entry of entries) {
        const { attribute, value } = entry
        if (value === undefined) {
            continue
        }
        const uiPath = DB_TO_UI_MAP[attribute]
        if (!uiPath) {
            continue
        }
        const pathSegments = uiPath.split('.')
        let target = uiConfig
        // Navigate/create nested structure
        while (pathSegments.length > 1) {
            const segment = pathSegments.shift()
            target[segment] = target[segment] || {}
            target = target[segment]
        }
        target[pathSegments[0]] = value
        // Mirror desktop content to mobile if needed
        // if (['cookieBannerNotice', 'preferenceManagerNotice'].includes(pathSegments[0])) {
        //     uiConfig.contentMobile[pathSegments[0]] = value
        // }
    }
    return uiConfig
}

/**
 * Converts a dictionary of language => text entries into structured UI configs per language.
 *
 * @param {Object<string, Array<{ attribute: string, value: string }>>} dict - Map of language -> text entries
 * @returns {Object<string, Object>} - UI configs keyed by language
 *
 * @example
 * const dict = {
 *   en: [
 *     { attribute: 'accept_all_button_text', value: 'Accept All' },
 *     { attribute: 'cookie_banner_notice', value: 'We use cookies' }
 *   ],
 *   hi: [
 *     { attribute: 'accept_all_button_text', value: 'सभी स्वीकारें' }
 *   ]
 * }
 *
 * const configs = multiLangTemplateTextToUIConfig(dict)
 *
 * // configs:
 * {
 *   en: {
 *     buttonsText: { acceptAll: 'Accept All' },
 *     contentDesktop: { cookieBannerNotice: 'We use cookies' },
 *     contentMobile: { cookieBannerNotice: 'We use cookies' },
 *     cookieCategoryDescriptions: {}
 *   },
 *   hi: {
 *     buttonsText: { acceptAll: 'सभी स्वीकारें' },
 *     contentDesktop: {},
 *     contentMobile: {},
 *     cookieCategoryDescriptions: {}
 *   }
 * }
 */
function multiLangTemplateTextToUIConfig(dict) {
    const result = {}
    for (const [lang, entries] of Object.entries(dict)) {
        result[lang] = { ...templateTextDictToUIConfig(entries), ...{ static: STATIC_BANNER_TEXT_TRANSLATIONS[lang] } }
    }
    return result
}

/**
 * Recursively flatten a nested object into dot notation paths.
 * Example: { buttonText: { acceptAll: "ok" } } -> { "buttonText.acceptAll": "ok" }
 */
function flattenObject(obj, parentKey = '') {
    let result = {}
    for (const [key, value] of Object.entries(obj)) {
        const newKey = parentKey ? `${parentKey}.${key}` : key
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            result = { ...result, ...flattenObject(value, newKey) }
        } else {
            result[newKey] = value
        }
    }
    return result
}

/**
 * Find DB attribute from a given UI path using DB_TO_UI_MAP.
 */
function findDbAttributeFromUiPath(uiPath) {
    for (const [dbAttr, mappedUiPath] of Object.entries(DB_TO_UI_MAP)) {
        if (mappedUiPath === uiPath) {
            return dbAttr
        }
    }
    return null
}

/**
 * Convert UI-language config into DB-ready rows
 *
 * @param {string} templateId
 * @param {Object} uiLanguages - e.g. { en: {...}, hi: {...} }
 * @returns {Array<Object>} rows ready for DB insert
 * @throws {Error} if a UI path doesn't exist in DB_TO_UI_MAP
 */
function buildTemplateLanguageRows(templateId, uiLanguages) {
    const rows = []
    for (const [language, langConfig] of Object.entries(uiLanguages)) {
        const flatConfig = flattenObject(langConfig)
        Object.entries(flatConfig).forEach(([uiPath, value]) => {
            const dbAttr = findDbAttributeFromUiPath(uiPath)
            if (!dbAttr) {
                const message = `Unknown UI path: ${uiPath} (lang: ${language})`
                throw UnexpectedError(message, 500, {
                    data: uiLanguages,
                    error: message
                })
            }
            const translationUUID = language === 'en' ? uuidv4() : null
            rows.push({
                template_id: templateId,
                language,
                attribute: dbAttr,
                value: String(value),
                ...(translationUUID && { translation_uuid: translationUUID })
            })
        })
    }

    return rows
}

export { extractTemplateConfig, templateTextDictToUIConfig, multiLangTemplateTextToUIConfig, buildTemplateLanguageRows }
