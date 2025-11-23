import dotenv from 'dotenv'
dotenv.config()

import { getCookieMasterByName } from '../db/cookie/cookie_master.services.js'

async function segregateCookiesByCategory(aggregatedCookies, domainId) {
    const categorizedCookies = {}
    const date = new Date()

    for (const domain of Object.keys(aggregatedCookies)) {
        await processDomainCookies(aggregatedCookies[domain], domainId, categorizedCookies, date)
    }

    return categorizedCookies
}

async function processDomainCookies(cookies, domainId, categorizedCookies, date) {
    const cookiesArray = Object.values(cookies)

    for (const cookie of cookiesArray) {
        const cookieInfo = await cookieDataCheck(cookie, domainId)
        if (cookieInfo) {
            const cookieData = createCookieData(cookieInfo, cookie, date)
            const categoryLower = cookieData.category.toLowerCase()
            // Initialize category array if it doesn't exist
            categorizedCookies[categoryLower] = categorizedCookies[categoryLower] || []
            categorizedCookies[categoryLower].push(cookieData)
        }
    }
}

function createCookieData(cookieInfo, cookie, date) {
    const { description, category } = cookieInfo
    const { name, domain, expires, ...cookieDetails } = cookie
    return {
        category,
        'cookie_name': name,
        description,
        domain,
        'expires_at': expires,
        'duration': unixTimestampDifference(date, expires),
        ...cookieDetails
    }
}

async function cookieDataCheck(cookie, domainId) {
    try {
        const cookieInfo = await getCookieMasterByName(cookie.domain, cookie.name, domainId)
        console.log('Found in cookie master', cookie.name)
        return cookieInfo
    } catch (error) {
        if (error.name && error.name !== 'NotFoundError') {
            throw error
        }
        console.log('Went to fallback to find cookie name', cookie.name)
        const cookieInfo = cookie
        cookieInfo.category = 'OTHERS'
        return cookieInfo
    }
}

/**
 * Formats a structured cookie duration object into a consistent metadata format.
 *
 * This function converts the duration input (either session-based or a
 * year/month/day breakdown) into a standardized object that includes the
 * human-readable duration string.
 *
 * Internally calls `convertExpiryInputToUnix()` to compute a UNIX expiry timestamp
 * and then derives the readable duration using `unixTimestampDifference()`.
 *
 * @function expiryFormatting
 * @param {Object} input - Duration object.
 * @param {boolean} input.is_session - Whether the cookie expires at session end.
 * @param {Object} input.expiry - Breakdown of expiry duration.
 * @param {number} input.expiry.years
 * @param {number} input.expiry.months
 * @param {number} input.expiry.days
 *
 * @returns {{ duration: string }}
 * An object containing:
 *  - `duration`: Human-readable duration string (e.g., "1 year", "6 months").
 *    For session cookies, this is simply `"session"`.
 *
 * @example
 * expiryFormatting({
 *   is_session: false,
 *   expiry: { years: 1, months: 0, days: 10 }
 * })
 * // → { duration: "1 year 10 days" }
 *
 * expiryFormatting({ is_session: true, expiry: { years: 0, months: 0, days: 0 } })
 * // → { duration: "session" }
 */
function expiryFormatting(input) {
    const convertExpiry = convertExpiryInputToUnix(input)
    const finalExpiry = unixTimestampDifference(new Date(), convertExpiry)
    const meta_data_expiry = {
        expires_at: convertExpiry,
        duration: finalExpiry
    }
    return meta_data_expiry
}

/**
 * Converts a structured cookie duration object into a UNIX expiry timestamp.
 *
 * - If `is_session` is true, returns `"session"`.
 * - Otherwise, computes the total number of days from years/months/days,
 *   adds it to the current date, and returns the resulting UNIX timestamp (seconds).
 *
 * This function assumes that:
 *   1 year   ≈ 365.25 days
 *   1 month ≈ 30.44 days
 *
 * @function convertExpiryInputToUnix
 * @param {Object|string} input - The duration object or the string `"session"`.
 * @param {boolean} input.is_session - Indicates session-only cookies.
 * @param {Object} input.expiry - Year/month/day components.
 * @param {number} input.expiry.years
 * @param {number} input.expiry.months
 * @param {number} input.expiry.days
 *
 * @returns {(number|string)} UNIX timestamp in seconds, or `"session"` for session cookies.
 *
 * @throws {Error} If the structure is invalid or calculation fails.
 *
 * @example
 * convertExpiryInputToUnix({
 *   is_session: false,
 *   expiry: { years: 1, months: 0, days: 20 }
 * })
 * // → 1762573810
 *
 * convertExpiryInputToUnix("session")
 * // → "session"
 *
 * convertExpiryInputToUnix({ is_session: true })
 * // → "session"
 */
function convertExpiryInputToUnix(input) {
    try {
        if (input.is_session === true || input === 'session') {
            return 'session'
        }
        const years = input.expiry.years || 0
        const months = input.expiry.months || 0
        const days = input.expiry.days || 0
        const totalDays = years * 365.25 + months * 30.44 + days
        const expiryDate = new Date()
        expiryDate.setDate(expiryDate.getDate() + totalDays)

        return Math.floor(expiryDate.getTime() / 1000)
    } catch (err) {
        console.error('Error converting expiry input:', err.message)
        throw err
    }
}

function unixTimestampDifference(date, unixTimestamp) {
    try {
        if (typeof unixTimestamp === 'string' && unixTimestamp.toLowerCase() === 'session') {
            return '0 year(s), 0 month(s), 0 day(s)'
        }
        // Convert the UNIX timestamp into a JavaScript Date object
        const targetDate = new Date(unixTimestamp * 1000) // Convert seconds to milliseconds
        // Calculate the difference in milliseconds
        const differenceInMs = Math.abs(targetDate - date) // Absolute difference to handle past/future
        // Convert the difference to days, months, and years
        const secondsInDay = 86400 // 24 * 60 * 60
        const daysInMonth = 30.44 // Average days in a month
        const daysInYear = 365.25 // Average days in a year
        const totalSeconds = differenceInMs / 1000
        const years = Math.floor(totalSeconds / (secondsInDay * daysInYear))
        const remainingAfterYears = totalSeconds % (secondsInDay * daysInYear)
        const months = Math.floor(remainingAfterYears / (secondsInDay * daysInMonth))
        const remainingAfterMonths = remainingAfterYears % (secondsInDay * daysInMonth)
        const days = Math.ceil(remainingAfterMonths / secondsInDay)

        return `${years} year(s), ${months} month(s), ${days} day(s)`
    } catch (error) {
        return unixTimestamp || 'NA'
    }
}

export { segregateCookiesByCategory, expiryFormatting }
