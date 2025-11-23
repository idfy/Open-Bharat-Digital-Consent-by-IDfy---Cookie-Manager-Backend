import { Prisma } from '@prisma/client'
import prisma from '../config.js'
import { UnexpectedError, NotFoundError } from '../../custom_error.js'
import { INTERNAL_SERVER_ERROR, ENGLISH_ENUM_VALUE } from '../../constants.js'
import { LANGUAGES_LIST_MASTER } from '../../language_translation/constants.js'
// Create
async function createCookieMasterLanguage(data) {
    try {
        const newCookieMasterLanguage = await prisma.cookieMasterLanguage.create({
            data
        })
        return newCookieMasterLanguage
    } catch (error) {
        throw UnexpectedError('Error in creating entry createCookieMasterLanguage', 500, {
            message: 'Error creating cookiemasterlanguage',
            data: String(error)
        })
    }
}

// Read all with pagination
async function getAllCookieMasterLanguages(domainId, page = 1, pageSize = 10, orderBy = 'desc') {
    const skip = (page - 1) * pageSize
    try {
        const total = await prisma.cookieMasterLanguage.count({
            domain_id: domainId
        })
        const cookieMasterLanguage = await prisma.cookieMasterLanguage.findMany({
            where: { domain_id: domainId },
            skip,
            take: pageSize,
            orderBy: { created_at: orderBy }
        })
        return {
            data: cookieMasterLanguage,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
        }
    } catch (error) {
        console.error('Error fetching cookieMasterLanguage:', error)
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            error: String(error)
        })
    }
}
async function updateManualCookieMasterLanguage(
    cookieMasterId,
    domainId,
    languageId,
    dataToUpdate,
    prismaTransaction = ''
) {
    try {
        const dbClient = prismaTransaction || prisma
        const updatedCookieMasterLanguage = await dbClient.cookieMasterLanguage.update({
            where: { cookie_master_id: cookieMasterId, domain_id: domainId, language_id: languageId },
            data: dataToUpdate
        })
        return updatedCookieMasterLanguage
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw NotFoundError(`No record found with this id: ${languageId}`, 404)
        }
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            data: String(error),
            id: languageId
        })
    }
}

// Update
async function updateCookieMasterLanguage(languageId, dataToUpdate, prismaTransaction = '') {
    try {
        const dbClient = prismaTransaction || prisma
        const updatedCookieMasterLanguage = await dbClient.cookieMasterLanguage.update({
            where: { language_id: languageId },
            data: dataToUpdate
        })
        return updatedCookieMasterLanguage
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw NotFoundError(`No record found with this id: ${languageId}`, 404)
        }
        throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, {
            data: String(error),
            id: languageId
        })
    }
}
/**
 * Bulk inserts cookies for a specific language.
 *
 * @param {Array<Object>} cookies - List of cookie records for a single language.
 * @param {string} language - The language code.
 * @param {string} domainId - The domain ID for the cookies.
 * @returns {Promise<number>} - Number of records successfully inserted.
 * @example
 * // Example input for cookies:
 * const cookies = [
 *   {
 *     cookie_master_id: 'uuid-1',
 *     name: 'Example Cookie',
 *     description: 'This is a cookie in English.'
 *   },
 *   {
 *     cookie_master_id: 'uuid-2',
 *     name: 'Example Cookie 2',
 *     description: 'This is another cookie in English.'
 *   }
 * ];
 *
 */
async function insertCookiesForLanguage(cookies, language, domainId) {
    try {
        await prisma.cookieMasterLanguage.createMany({
            data: cookies.map((cookie) => ({
                cookie_master_id: cookie.cookie_master_id,
                language,
                name: cookie.name,
                description: cookie.description,
                domain_id: domainId
            })),
            skipDuplicates: true // This will skip records that already exist
        })

        return language
    } catch (error) {
        throw UnexpectedError(`Failed to insert cookies for language: ${language}`, 500, {
            data: String(error),
            domain_id: domainId
        })
    }
}
/**
 * Retrieves all unique cookie_master_ids for a given scan and domain.
 *
 * @param {string} scanId - The ID of the scan to filter cookies.
 * @param {string} domainId - The ID of the domain to filter cookie masters.
 * @returns {Promise<string[]>} - A promise that resolves to an array of unique cookie_master_ids.
 */
async function getRelevantCookieMasterIds(scanId, domainId) {
    const cookies = await prisma.cookie.findMany({
        where: {
            scan_id: scanId,
            cookie_master: { domain_id: domainId }
        },
        select: { cookie_master_id: true },
        distinct: ['cookie_master_id']
    })
    return cookies.map((c) => c.cookie_master_id)
}

/**
 * Retrieves all available languages for the provided cookie_master_ids.
 *
 * @param {string[]} cookieMasterIds - An array of cookie_master_ids to fetch languages for.
 * @returns {Promise<Array<{ cookie_master_id: string, language: string }>>} - A promise that resolves to an array of objects containing cookie_master_id and their corresponding languages.
 */
async function getCookieMasterLanguages(cookieMasterIds) {
    const data = await prisma.cookieMasterLanguage.findMany({
        where: { cookie_master_id: { in: cookieMasterIds } },
        select: { cookie_master_id: true, language: true }
    })
    return data
}

/**
 * Retrieves the English name and description for the provided cookie_master_ids.
 *
 * @param {string[]} cookieMasterIds - An array of cookie_master_ids to fetch English translations for.
 * @returns {Promise<Array<{ cookie_master_id: string, name: string, description: string }>>} - A promise that resolves to an array of objects containing cookie_master_id, name, and description in English.
 */
async function getCookieMasterEnglishTranslations(cookieMasterIds) {
    const data = await prisma.cookieMasterLanguage.findMany({
        where: {
            cookie_master_id: { in: cookieMasterIds },
            language: ENGLISH_ENUM_VALUE
        },
        select: {
            cookie_master_id: true,
            name: true,
            description: true
        }
    })
    return data
}

// /**
//  * Combines the language entries and English translations into a unified structure.
//  *
//  * @param {Array<{ cookie_master_id: string, language: string }>} languageEntries - List of cookie master languages for each ID.
//  * @param {Array<{ cookie_master_id: string, name: string, description: string }>} englishTranslations - List of English name and description for each cookie master ID.
//  * @returns {Array<{ cookie_master_id: string, languages_present: string[], name: string, description: string }>} - Combined result with languages, name, and description for each cookie master.
//  */
// function combineCookieMasterData(languageEntries, englishTranslations) {
//     const masterMap = {}
//     languageEntries.forEach((entry) => {
//         if (!masterMap[entry.cookie_master_id]) {
//             masterMap[entry.cookie_master_id] = {
//                 cookie_master_id: entry.cookie_master_id,
//                 languages_present: []
//             }
//         }
//         masterMap[entry.cookie_master_id].languages_present.push(entry.language)
//     })

//     // Map English translations
//     const englishMap = new Map(englishTranslations.map((t) => [t.cookie_master_id, t]))

//     // Combine data
//     return Object.values(masterMap).map((master) => ({
//         ...master,
//         name: englishMap.get(master.cookie_master_id)?.name || '',
//         description: englishMap.get(master.cookie_master_id)?.description || ''
//     }))
// }

/**
 * Combines the language entries and English translations into a unified structure.
 * For each cookie master, it provides missing languages based on LANGUAGES_LIST_MASTER.
 *
 * @param {Array<{ cookie_master_id: string, language: string }>} languageEntries - List of cookie master languages for each ID.
 * @param {Array<{ cookie_master_id: string, name: string, description: string }>} englishTranslations - List of English name and description for each cookie master ID.
 * @returns {Array<{ cookie_master_id: string, missing_languages: string[], name: string, description: string }>} - Combined result with missing languages, name, and description for each cookie master.
 */
function combineCookieMasterData(languageEntries, englishTranslations) {
    const masterMap = {}

    // Group languages by cookie_master_id
    languageEntries.forEach((entry) => {
        if (!masterMap[entry.cookie_master_id]) {
            masterMap[entry.cookie_master_id] = {
                cookie_master_id: entry.cookie_master_id,
                presentLanguages: new Set()
            }
        }
        masterMap[entry.cookie_master_id].presentLanguages.add(entry.language)
    })

    // Map English translations for quick lookup
    const englishMap = new Map(englishTranslations.map((t) => [t.cookie_master_id, t]))

    // Combine data and calculate missing languages
    return Object.values(masterMap).map((master) => {
        const missingLanguages = LANGUAGES_LIST_MASTER.filter((lang) => !master.presentLanguages.has(lang))

        return {
            cookie_master_id: master.cookie_master_id,
            missing_languages: missingLanguages,
            name: englishMap.get(master.cookie_master_id)?.name || 'Not Present',
            description: englishMap.get(master.cookie_master_id)?.description || 'Not Present'
        }
    })
}
/**
 * Retrieves and combines cookie master data (languages and English descriptions) for a given scan and domain.
 *
 * @param {string} scanId - The ID of the scan to filter cookies.
 * @param {string} domainId - The ID of the domain to filter cookie masters.
 * @returns {Promise<Array<{ cookie_master_id: string, languages_present: string[], name: string, description: string }>>} - A promise that resolves to the complete cookie master data set ready for translation.
 */
async function getCookieMasterDataToTranslate(scanId, domainId) {
    const cookieMasterIds = await getRelevantCookieMasterIds(scanId, domainId)
    if (!cookieMasterIds.length) {
        return []
    }
    const [languages, englishData] = await Promise.all([
        getCookieMasterLanguages(cookieMasterIds),
        getCookieMasterEnglishTranslations(cookieMasterIds)
    ])

    return combineCookieMasterData(languages, englishData)
}

export {
    createCookieMasterLanguage,
    getAllCookieMasterLanguages,
    updateCookieMasterLanguage,
    insertCookiesForLanguage,
    getCookieMasterDataToTranslate,
    updateManualCookieMasterLanguage
}
