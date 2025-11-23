import express from 'express'
import validateSchemaPostCall from '../middlewares/post_routes.middleware.js'
import validateSchemaGetCall from '../middlewares/get_routes.middleware.js'
import checkArchivalAccess from '../middlewares/archival_access.middleware.js'
import checkEditorAccess from '../middlewares/editor_access.middleware.js'

import {
    createBannerSchema,
    changeBannerStatusSchema,
    getAllBannerSchema,
    bannerArchivalSchema
} from '../validations/banner.validations.js'
import {
    changeBannerStatus,
    createBanner,
    showBanners,
    archiveBanner,
    unarchiveBanner
} from '../controllers/banner.controller.js'

const bannerRouter = express.Router()

bannerRouter.post('/cookie-banner/create', validateSchemaPostCall(createBannerSchema), checkEditorAccess, createBanner)

bannerRouter.patch(
    '/cookie-banner/change-status',
    validateSchemaPostCall(changeBannerStatusSchema),
    checkEditorAccess,
    changeBannerStatus
)
bannerRouter.get('/cookie-banners/:domainId', validateSchemaGetCall(getAllBannerSchema), checkEditorAccess, showBanners)

bannerRouter.patch(
    '/cookie-banner/archive/:bannerId',
    checkArchivalAccess,
    validateSchemaPostCall(bannerArchivalSchema),
    archiveBanner
)
bannerRouter.patch(
    '/cookie-banner/unarchive/:bannerId',
    checkArchivalAccess,
    validateSchemaPostCall(bannerArchivalSchema),
    unarchiveBanner
)

export default bannerRouter
