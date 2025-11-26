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

import { TranslationServiceClient } from '@google-cloud/translate'
import { ENGLISH_ENUM_VALUE } from '../constants.js'

async function googleTranslateTextHandler(requestId, arrayOfText, targetLanguage) {
    const projectId = process.env.PROJECT_ID
    const client = new TranslationServiceClient()
    const location = 'global'
    const request = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: arrayOfText,
        mimeType: 'text/plain',
        sourceLanguageCode: ENGLISH_ENUM_VALUE,
        // 'transliteration_config': { 'enable_transliteration': true },
        targetLanguageCode: targetLanguage
    }
    try {
        console.log('Language Translation for requestId', requestId, targetLanguage)
        const [response] = await client.translateText(request)
        const translationJson = response.translations
        const data = translationJson.map((item) => item.translatedText)
        return data
    } catch (error) {
        console.error(`Error during translation: for ${requestId}`, error)
        return null
    }
}
export { googleTranslateTextHandler }
