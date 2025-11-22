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
