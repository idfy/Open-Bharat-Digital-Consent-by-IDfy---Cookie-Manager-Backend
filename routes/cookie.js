import express from 'express'
import {
    addCookieHandler,
    deleteCookieHandler,
    updateCookiesHandler,
    updateManualCookieHandler,
    addCookiesCSVHandler
} from '../controllers/cookie.controller.js'
import validateSchemaPostCall from '../middlewares/post_routes.middleware.js'
import {
    addManualCookiesSchema,
    deleteCookieSchema,
    updateCookiesSchema,
    updateManualCookieSchema,
    uploadCSVSchema
} from '../validations/cookie.validations.js'
import checkEditorAccess from '../middlewares/editor_access.middleware.js'
import { upload } from '../services/utils/multer_utils.services.js'
const cookieRouter = express.Router()
cookieRouter.patch(
    '/cookies/update/:scanId',
    validateSchemaPostCall(updateCookiesSchema),
    checkEditorAccess,
    updateCookiesHandler
)
cookieRouter.post(
    '/cookies/add/:scanId',
    checkEditorAccess,
    validateSchemaPostCall(addManualCookiesSchema),
    addCookieHandler
)
cookieRouter.post(
    '/cookies/upload-csv/:scanId',
    checkEditorAccess,
    upload.single('file'),
    validateSchemaPostCall(uploadCSVSchema),
    addCookiesCSVHandler
)
cookieRouter.patch(
    '/cookies/delete',
    validateSchemaPostCall(deleteCookieSchema),
    checkEditorAccess,
    deleteCookieHandler
)
cookieRouter.patch(
    '/cookies/update-manual-cookie/:scanId',
    validateSchemaPostCall(updateManualCookieSchema),
    checkEditorAccess,
    updateManualCookieHandler
)

export default cookieRouter
