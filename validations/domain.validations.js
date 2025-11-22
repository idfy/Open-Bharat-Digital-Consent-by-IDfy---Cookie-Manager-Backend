import Joi from 'joi'

const createDomainSchema = Joi.object({
    url: Joi.string()
        .uri({ scheme: ['http', 'https'] })
        .required()
}).unknown()

export { createDomainSchema }
