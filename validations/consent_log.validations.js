import Joi from 'joi'
import { uuidSchema } from './common.validations.js'

const showConsentLogsSchema = Joi.object({
    banner_id: Joi.array().items(uuidSchema).min(1).optional(),
    start_time: Joi.string()
        .isoDate() // Validates ISO 8601 format
        .optional(),
    end_time: Joi.string()
        .isoDate()
        .optional()
        .custom((value, helpers) => {
            const { start_time } = helpers.state.ancestors[0]
            if (start_time && value) {
                const startTime = new Date(start_time)
                const endTime = new Date(value)
                // Ensure end_time is after or the same as start_time
                if (endTime < startTime) {
                    return helpers.message(
                        '"end_time" must be greater than or equal to "start_time"'
                    )
                }
            }
            return value
        }, 'End time validation')
}).unknown()

export { showConsentLogsSchema }
