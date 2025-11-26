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

function validateSchemaExternalPostCall(schema) {
    return (req, res, next) => {
        const bodyData = req.body || {}
        const params = req.params || {}
        const data = { ...bodyData, ...params }
        const { error } = schema.validate(data)
        if (error) {
            console.log('In error postcall', bodyData, params, error.message)
            return res.status(400).json({
                message: 'Invalid request data'
            })
        }
        next()
    }
}

export default validateSchemaExternalPostCall
