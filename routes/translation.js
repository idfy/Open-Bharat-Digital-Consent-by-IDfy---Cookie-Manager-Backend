import express from 'express'
import { translateTemplate } from '../controllers/translation.controller.js'
const translateRouter = express.Router()
translateRouter.post('/template', translateTemplate)

export default translateRouter
