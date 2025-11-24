import prisma from '../db/config.js'
import { UnexpectedError } from '../custom_error.js'

async function createEventAnalytics(data) {
    try {
        const newEvent = await prisma.eventAnalytics.create({
            data
        })
        return newEvent
    } catch (error) {
        throw UnexpectedError('Error in creating entry', 500, {
            message: 'Error creating event',
            data: String(error)
        })
    }
}

export { createEventAnalytics }
