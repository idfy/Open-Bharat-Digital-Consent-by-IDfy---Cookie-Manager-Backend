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

function validateSchemaGetCall(schema) {
    return (req, res, next) => {
        const queryParams = req.query || {}
        const params = req.params || {}
        const data = { ...queryParams, ...params }
        const { error } = schema.validate(data)
        console.log('queryParams, params', queryParams, params)
        if (error) {
            console.log('In error', queryParams, params)
            return res.status(400).json({
                message: 'Invalid request data',
                details: error.message
            })
        }
        next()
    }
}

export default validateSchemaGetCall
