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
