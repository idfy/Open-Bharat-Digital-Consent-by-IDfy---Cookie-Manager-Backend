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

import { Prisma } from '@prisma/client'
import prisma from './config.js'

async function getConfigByDomainAndType(domainId, type) {
    try {
        const config = await prisma.config.findUnique({
            where: {
                domain_id_type: {
                    domain_id: domainId,
                    type
                }
            },
            select: {
                value: true
            }
        })

        if (!config) {
            return ''
        }

        return config.value
    } catch (error) {
        if (error.name === 'NotFoundError') {
            return ''
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return ''
        }

        return ''
    }
}

export { getConfigByDomainAndType }
