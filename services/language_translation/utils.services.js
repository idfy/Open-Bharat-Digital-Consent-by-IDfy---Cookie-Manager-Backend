import { googleTranslateTextHandler } from './google_translation.services.js'
import { retryWithBackoff, createBatches } from '../utils.services.js'
import { GT_LIST } from './constants.js'
import { ENGLISH_ENUM_VALUE } from '../constants.js'
function getTranslationHandler(languageCode) {
    if (GT_LIST.includes(languageCode)) {
        return googleTranslateTextHandler
    }
    throw new Error(`No supported translation engine for language: ${languageCode}`)
}

function getExtractionKey(type) {
    if (type === 'template') {
        return 'value'
    }
    if (type === 'cookies') {
        return 'description'
    }
    throw new Error(`No supported translation of ${type}}`)
}
function getFilteredBatch(batch, textExtractionKey) {
    const textsToTranslateBatch = batch.map((item) => item[textExtractionKey])
    const filteredBatchLength = textsToTranslateBatch.length
    return { textsToTranslateBatch, filteredBatchLength }
}

async function translateInBatchesWithRetry(items, targetLanguage, type) {
    const batches = createBatches(items, 100)
    const results = []
    const translateFn = getTranslationHandler(targetLanguage)
    const textExtractionKey = getExtractionKey(type)
    for (const [batchIndex, batch] of batches.entries()) {
        const { textsToTranslateBatch, filteredBatchLength } = getFilteredBatch(batch, textExtractionKey)
        const translatedTexts = await retryWithBackoff(
            () => translateFn(`batch-${batchIndex}`, textsToTranslateBatch, targetLanguage),
            3, // max retries
            500 // initial backoff delay in ms
        )
        // Validate response length
        if (translatedTexts.length !== filteredBatchLength) {
            throw new Error(
                `Translation count mismatch: expected ${filteredBatchLength}, got ${translatedTexts.length}`
            )
        }
        mapTranslations(results, batch, translatedTexts, targetLanguage, type)
    }

    return results
}

/**
 * Maps a batch of template items with their translated values.
 *
 * @param {Array<Object>} items - Original template items in the batch.
 * @param {Array<string>} translatedTexts - Translated values corresponding to items.
 * @param {String} language - Translated Language
 * @returns {Array<Object>} Array of objects combining original IDs and translated values.
 */
function mapTemplateTranslations(results, items, translatedTexts, language) {
    for (let i = 0; i < items.length; i++) {
        results.push({
            attribute: items[i].attribute,
            translation_uuid: items[i].translation_uuid,
            language,
            value: translatedTexts[i]
        })
    }
    return results
}

/**
 * Returns the appropriate translation mapping function for a given type.
 *
 * @param {string} type - Type of items to translate ('template').
 * @returns {Function} Mapping function for the specified type.
 */
function mapTranslations(results, batch, translatedTexts, language, type) {
    if (type === 'template') {
        return mapTemplateTranslations(results, batch, translatedTexts, language)
    }
    throw new Error(`No supported translation mapping for type: ${type}`)
}

async function translateToMultipleLanguages(items, targetLanguages, userId, type) {
    /* eslint-disable-next-line require-await */
    const translationPromises = targetLanguages.map(async (language) => {
        console.log(`Translating into ${language}...`)
        return translateInBatchesWithRetry(items, language, type)
            .then((translations) => ({ language, translations }))
            .catch((error) => ({ language, error }))
    })

    const results = await Promise.allSettled(translationPromises)

    const allTranslations = groupTranslationsByLanguage(results)
    return allTranslations
}

/**
 * Returns the set difference of two arrays: all elements in `a` that are not in `b`.
 *
 * @template T
 * @param {T[]} a - The array to compare from (source array).
 * @param {T[]} b - The array to compare against (values to exclude).
 * @returns {T[]} A new array containing elements from `a` that are not present in `b`.
 *
 * @example
 * differenceOfArrays([1, 2, 3, 5, 7], [1, 2, 4, 5, 6])
 * // => [3, 7]
 */
function differenceOfArrays(a, b) {
    const bSet = new Set(b)
    return a.filter((item) => !bSet.has(item))
}

/**
 * Finds attributes where the `translation_uuid` of a given language
 * differs from the English version.
 *
 * @param {Object<string, Array<{attribute: string, translation_uuid: string}>>} templateTextEntriesEnglish
 *   English entries keyed by language code (only ENGLISH_ENUM_VALUE will exist).
 * @param {Object<string, Array<{attribute: string, translation_uuid: string}>>} textEntriesByLanguage
 *   Entries for all languages keyed by language code.
 * @returns {Object<string, { languages: string[], translation_uuid: string }>}
 *   An object where each key is an attribute, and the value contains:
 *   - `languages`: array of language codes that have a mismatched `translation_uuid`
 *   - `translation_uuid`: the English `translation_uuid`
 */
function findMismatchedTranslationUUIDs(templateTextEntriesEnglish, textEntriesByLanguage) {
    const englishEntries = templateTextEntriesEnglish[ENGLISH_ENUM_VALUE] || []
    const englishMap = Object.fromEntries(englishEntries.map((entry) => [entry.attribute, entry.translation_uuid]))

    const mismatches = {}

    for (const [lang, entries] of Object.entries(textEntriesByLanguage)) {
        if (lang === ENGLISH_ENUM_VALUE) {
            continue
        }
        addMismatches(mismatches, englishMap, lang, entries)
    }
    return mismatches
}

/**
 * Adds mismatched translation UUIDs for a single language to the mismatches object.
 *
 * @param {Object<string, { languages: string[], translation_uuid: string }>} mismatches
 *   Collector object storing mismatches by attribute.
 * @param {Object<string, string>} englishMap
 *   Map of attribute → English `translation_uuid`.
 * @param {string} lang
 *   The language code being compared (e.g. 'fr', 'hi').
 * @param {Array<{attribute: string, translation_uuid: string}>} entries
 *   The translation entries for this language.
 * @returns {void}
 */
function addMismatches(mismatches, englishMap, lang, entries) {
    for (const { attribute, translation_uuid } of entries) {
        const englishUUID = englishMap[attribute]
        if (englishUUID && englishUUID !== translation_uuid) {
            mismatches[attribute] ??= { languages: [], translation_uuid: englishUUID }
            mismatches[attribute].languages.push(lang)
        }
    }
}

/**
 * Pivots the mismatch data to create a list of translation items grouped by language.
 * This is the extracted helper function for better readability.
 */
function prepareTranslationJobs(mismatch, englishEntriesMap) {
    const itemsToTranslateByLang = {}

    for (const [attribute, details] of Object.entries(mismatch)) {
        const englishSourceEntry = englishEntriesMap.get(attribute)

        if (!englishSourceEntry) {
            console.warn(`Could not find English source text for mismatched attribute: ${attribute}`)
            continue
        }

        for (const lang of details.languages) {
            itemsToTranslateByLang[lang] ??= []
            itemsToTranslateByLang[lang].push(englishSourceEntry)
        }
    }
    return itemsToTranslateByLang
}

/**
 * Processes results from promise executions, grouping successful translations by language.
 * Logs errors for any failed jobs.
 *
 * @param {Array<Object>} results - The array of result objects from Promise.allSettled.
 * @returns {Object<string, Array<Object>>} An object where each key is a language code,
 *   and the value is the array of successfully translated rows for that language.
 */
function groupTranslationsByLanguage(results) {
    const allTranslations = {} // The return value will be an object.

    for (const result of results) {
        if (result.status === 'fulfilled') {
            // console.log('Translation successful for language:', result, result.value)
            const { language, translations } = result.value
            allTranslations[language] = translations
        } else {
            // The `reason` contains the error details for a failed language.
            const { language } = result.reason
            // console.error(`Translation failed for language ${language}:`, error)
            // Provide a fallback value to ensure consistency.
            allTranslations[language] = []
        }
    }

    return allTranslations
}
export {
    getTranslationHandler,
    translateToMultipleLanguages,
    differenceOfArrays,
    findMismatchedTranslationUUIDs,
    translateInBatchesWithRetry,
    prepareTranslationJobs,
    groupTranslationsByLanguage
}
