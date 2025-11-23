import express from 'express'

import {
    initiateScan,
    showScans,
    showIndividualScan,
    archiveScan,
    unarchiveScan
} from '../controllers/scan.controller.js'
import validateSchemaPostCall from '../middlewares/post_routes.middleware.js'
import validateSchemaGetCall from '../middlewares/get_routes.middleware.js'
import checkArchivalAccess from '../middlewares/archival_access.middleware.js'

import {
    initiateScanSchema,
    showScansSchema,
    showIndividualScanSchema,
    scanArchivalSchema
} from '../validations/scan.validations.js'
import checkScanAccess from '../middlewares/scan_access_middleware.js'


const scanRouter = express.Router()
scanRouter.post(
    '/scan-cookies',
    validateSchemaPostCall(initiateScanSchema),
    checkScanAccess,
    initiateScan
)
scanRouter.get(
    '/scans/:domainId',
    validateSchemaGetCall(showScansSchema),
    checkScanAccess,
    showScans
)
scanRouter.get(
    '/scan/:scanId',
    validateSchemaGetCall(showIndividualScanSchema),
    checkScanAccess,
    showIndividualScan
)
scanRouter.patch(
    '/scan/archive/:scanId',
    checkArchivalAccess,
    validateSchemaPostCall(scanArchivalSchema),
    archiveScan
)
scanRouter.patch(
    '/scan/unarchive/:scanId',
    checkArchivalAccess,
    validateSchemaPostCall(scanArchivalSchema),
    unarchiveScan
)

export default scanRouter
