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
