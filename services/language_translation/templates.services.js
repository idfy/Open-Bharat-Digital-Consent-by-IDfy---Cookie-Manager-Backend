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

import { handleServiceError } from '../utils.services.js'
import { getTemplateById, updateTemplateWithLanguages } from '../db/template.services.js'
import { ENGLISH_ENUM_VALUE } from '../constants.js'
import { translateToMultipleLanguages, differenceOfArrays, findMismatchedTranslationUUIDs } from './utils.services.js'
import { bulkInsertTemplateTranslations } from '../db/templates_languages.js'
import { buildTemplateLanguageRows } from '../templates/utils.js'
import {
    prepareTranslationJobs,
    translateInBatchesWithRetry,
    groupTranslationsByLanguage
} from '../language_translation/utils.services.js'
// import { LANGUAGES_LIST_MASTER_WITHOUT_ENGLISH } from './constants.js'
async function handleTemplateTranslation(userId, templateId, languages, modifiedValuesEnglish) {
    const result = {
        status_code: 200,
        message: 'Translation successfully'
    }
    try {
        const { textEntriesByLanguage: templateTextEntriesEnglish, translatedLanguages } = await getTemplateById(
            templateId,
            [ENGLISH_ENUM_VALUE]
        )
        const data = await translateTemplateData(
            templateId,
            templateTextEntriesEnglish[ENGLISH_ENUM_VALUE],
            translatedLanguages,
            languages,
            userId
        )
        result['data'] = data
        const uniqueLanguages = [
            ...new Set(
                [...translatedLanguages, ...data.languages_inserted]
                    .map((lang) => lang.trim().toLowerCase())
                    .filter((lang) => lang !== 'en')
            )
        ]
        const missingLanguages = await translateModifiedEnglishValues(
            userId,
            templateId,
            modifiedValuesEnglish,
            uniqueLanguages
        )
        result['data']['modified_values_language_failed'] = missingLanguages
        return result
    } catch (error) {
        console.log('error', error)
        return handleServiceError(result, error, {}, 'individualLanguageInsert')
    }
}

async function translateModifiedEnglishValues(userId, templateId, modifiedValuesEnglish, languages) {
    let missedLanguages = []
    if (
        modifiedValuesEnglish &&
        typeof modifiedValuesEnglish === 'object' &&
        Object.keys(modifiedValuesEnglish).length > 0
    ) {
        // Change here
        const languageRows = buildTemplateLanguageRows(templateId, modifiedValuesEnglish)
        const allTranslations = await translateToMultipleLanguages(languageRows, languages, userId, 'template')
        const { flattenLangData, missingLanguages } = flattenLanguageData(allTranslations, templateId)
        const languageData = [...languageRows, ...flattenLangData]
        await updateTemplateWithLanguages(templateId, {}, languageData)
        missedLanguages = missingLanguages
    }
    const missingTranslations = await translateMismatchedValues(templateId)
    if (missingTranslations.length === 0) {
        return missedLanguages
    }
    await updateTemplateWithLanguages(templateId, {}, missingTranslations)
    console.log('Missing Translations:', missingTranslations)
    return missedLanguages
}

/**
 * Identifies, translates, and returns values for attributes where the translation
 * is not up-to-date with the English source text.
 *
 * @param {string} templateId - The ID of the template to process.
 * @returns {Promise<Array<Object>>} A promise that resolves to a flat array of
 *   database-ready rows for the outdated translations that have now been updated.
 */
async function translateMismatchedValues(templateId) {
    try {
        const { textEntriesByLanguage: templateTextEntriesEnglish, translatedLanguages } = await getTemplateById(
            templateId,
            [ENGLISH_ENUM_VALUE]
        )
        const { textEntriesByLanguage } = await getTemplateById(templateId, translatedLanguages)
        const mismatch = findMismatchedTranslationUUIDs(templateTextEntriesEnglish, textEntriesByLanguage)
        // If there's nothing to translate, exit early.
        if (Object.keys(mismatch).length === 0) {
            console.log('All translations are up to date.')
            return []
        }
        console.log('translateMismatchedValues', mismatch)
        const englishEntriesMap = new Map(
            templateTextEntriesEnglish[ENGLISH_ENUM_VALUE].map((entry) => [entry.attribute, entry])
        )
        const itemsToTranslateByLang = prepareTranslationJobs(mismatch, englishEntriesMap)
        // Step 4: Call the translation service for each language that has pending work.
        const translationPromises = Object.entries(itemsToTranslateByLang).map(([language, items]) => {
            console.log(`Found ${items.length} mismatched item(s) for language: ${language}. Starting translation.`)
            return translateInBatchesWithRetry(items, language, 'template')
                .then((translations) => ({ language, translations, status: 'fulfilled' }))
                .catch((error) => ({ language, error, status: 'rejected' }))
        })
        const results = await Promise.allSettled(translationPromises)
        const groupedTranslations = groupTranslationsByLanguage(results)
        const allTranslatedRows = Object.values(groupedTranslations).flat()
        // The function returns a flat array of updated rows, ready for a bulk DB update.
        return allTranslatedRows
    } catch (error) {
        console.log('Error in translateMismatchedValues:', error)
        return []
    }
}

async function translateTemplateData(templateId, templateTextEntriesEnglish, translatedLanguages, languages, userId) {
    const languagesRequiringFullTranslations = differenceOfArrays(
        // LANGUAGES_LIST_MASTER_WITHOUT_ENGLISH,
        languages,
        translatedLanguages
    )
    if (languagesRequiringFullTranslations.length === 0) {
        return { languages_inserted: [], languages_failed: [] }
    }
    const allTranslations = await translateToMultipleLanguages(
        templateTextEntriesEnglish,
        languagesRequiringFullTranslations,
        userId,
        'template'
    )
    const result = await bulkInsertTemplateTranslations(templateId, allTranslations)
    return result
}

/**
 * Flattens language-attribute grouped object into DB insertable rows.
 *
 * @param {Object} groupedData - Object keyed by language with arrays of { attribute, language, value }.
 * @param {string} templateId - The template_id to attach to each row.
 * @returns {{ flattenLangData: Array<Object>, missingLanguages: Array<string> }}
 *          flattenLangData = flattened array ready for DB,
 *          missingLanguages = list of languages that were undefined or invalid.
 */
function flattenLanguageData(groupedData, templateId) {
    if (!groupedData || typeof groupedData !== 'object') {
        return { rows: [], missing: [] }
    }

    const flattenLangData = []
    const missingLanguages = []

    for (const [language, entries] of Object.entries(groupedData)) {
        if (!Array.isArray(entries)) {
            missingLanguages.push(language)
            continue
        }
        for (const entry of entries) {
            flattenLangData.push({
                template_id: templateId,
                language,
                attribute: entry.attribute,
                translation_uuid: entry.translation_uuid,
                value: entry.value
            })
        }
    }
    return { flattenLangData, missingLanguages }
}

export { handleTemplateTranslation }
