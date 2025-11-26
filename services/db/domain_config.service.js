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
