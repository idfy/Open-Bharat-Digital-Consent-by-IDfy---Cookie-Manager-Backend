import express from 'express'

import { health } from '../controllers/base.controller.js'

const baseRouter = express.Router()
baseRouter.get('/_health', health)
export default baseRouter
