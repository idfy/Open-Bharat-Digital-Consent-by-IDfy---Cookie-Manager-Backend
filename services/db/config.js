/**
 * Open Bharat Digital Consent by IDfy
 * Copyright (c) 2025 Baldor Technologies Private Limited (IDfy)
 * 
 * This software is licensed under the Privy Public License.
 * See LICENSE.md for the full terms of use.
 * 
 * Unauthorized copying, modification, distribution, or commercial use
 * is strictly prohibited without prior written permission from IDfy.
 */

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({ log: ['info'] })

// const prisma = new PrismaClient({
//     log: ['query', 'info', 'warn', 'error']
// })

async function initPrisma() {
    try {
        await prisma.$connect()
        console.log('✅ Database connected')
    } catch (err) {
        console.error('❌ Database connection failed', err)
        // throw err
        // alert here
        // process.exit(1) // exit if DB isn’t available
    }
}

initPrisma()
export default prisma
