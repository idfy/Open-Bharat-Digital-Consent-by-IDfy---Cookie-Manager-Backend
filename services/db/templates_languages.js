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

import prisma from './config.js'

async function bulkInsertTemplateTranslations(templateId, allTranslations) {
    const result = { languages_inserted: [], languages_failed: [] }

    await prisma.$transaction(async (tx) => {
        // Insert translations per language
        for (const [language, translations] of Object.entries(allTranslations)) {
            if (!translations || !translations.length) {
                console.log(`No translations for ${language}`)
                result['languages_failed'].push(language)
                continue
            }
            await tx.templatesLanguages.createMany({
                data: translations.map((t) => ({
                    template_id: templateId,
                    attribute: t.attribute,
                    value: t.value,
                    language: t.language,
                    translation_uuid: t.translation_uuid
                })),
                skipDuplicates: true
            })
            result['languages_inserted'].push(language)
        }
        if (result.languages_inserted.length > 0) {
            const currentTemplate = await tx.template.findUnique({
                where: { template_id: templateId },
                select: { languages: true }
            })
            const existingLanguages = currentTemplate?.languages || ['en']
            const combinedLanguages = [...new Set([...existingLanguages, ...result.languages_inserted])]
            await tx.template.update({
                where: { template_id: templateId },
                data: {
                    languages: combinedLanguages
                }
            })
        }
    })
    return result
}

export { bulkInsertTemplateTranslations }
