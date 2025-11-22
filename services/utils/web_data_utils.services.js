import dotenv from 'dotenv'
dotenv.config()

/**
 * Extracts the domain name from a URL.
 *
 * @param {string} url - The URL from which to extract the domain name.
 * @returns {string} The extracted domain name, or 'Error_Domain' if an error occurs.
 */
function extractDomainName(url) {
    const string =
        /^(?:https?:\/\/)?(?:www\.)?([a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,})(?:\/|$)/
    const match = string.exec(url)
    try {
        const domainParts = match[1].split('.')
        const domainSegments = domainParts.slice(-2)
        const domain = domainSegments.join('.')
        return domain
    } catch (error) {
        return 'Error_Domain'
    }
}

export { extractDomainName }
