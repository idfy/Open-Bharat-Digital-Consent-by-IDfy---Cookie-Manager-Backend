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
