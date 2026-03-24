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

import multer from 'multer'
import { FILE_SIZE_MB } from '../constants.js'

const storage = multer.memoryStorage()

function fileFilter(req, file, callback) {
    if (!file) {
        return callback(new Error('No file uploaded'), false)
    }
    const allowedMimes = [
        'text/csv',
        'application/csv'
    ]
    if (!allowedMimes.includes(file.mimetype)) {
        return callback(new Error('Only CSV files are allowed'), false)
    }
    callback(null, true)
}

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: FILE_SIZE_MB }
})
