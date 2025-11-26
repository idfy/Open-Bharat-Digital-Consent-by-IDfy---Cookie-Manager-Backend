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

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Load configuration file dynamically based on the environment.
 * @param {string} env - The environment name (local, staging, prod).
 * @returns {Promise<object>} - The config object containing domainId, and url.
 */
async function loadConfig(env) {
    try {
        const module = await import(`./${env}.js`)
        return module.config
    } catch (error) {
        console.error(`Error loading configuration for '${env}':`, error)
    }
}

/**
 * Upserts the domain data into the database.
 * @param {string} domainId - The domain ID.
 * @param {string} url - The URL.
 */
async function upsertDomain(domainId, url) {
    try {
        await prisma.Domain.upsert({
            where: { domain_id: domainId },
            update: {},
            create: {
                domain_id: domainId,
                url
            }
        })
        console.log('Seeding completed successfully!')
    } catch (error) {
        console.error('Error seeding data:', error)
    }
}

/**
 * Main function to execute the seeding process.
 */
async function main() {
    const env = process.argv[2] || 'local' // Default to 'local'
    console.log(`Running seeder for environment: ${env}`)

    const { domainId, url } = await loadConfig(env)
    await upsertDomain(domainId, url)

    await prisma.$disconnect()
}

main().catch(async (error) => {
    console.error('Unexpected error:', error)
    await prisma.$disconnect()
})
