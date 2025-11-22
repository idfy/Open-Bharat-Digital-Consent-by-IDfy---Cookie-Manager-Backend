import express from 'express'
import { externalGetRoutesGenericInstrumentation } from '../middlewares/routing_log.middleware.js'
import { sendJSFile } from '../controllers/external.controller.js'
const externalAssetsRouter = express.Router()
externalAssetsRouter.get('/:bannerId', externalGetRoutesGenericInstrumentation, sendJSFile)
export default externalAssetsRouter
