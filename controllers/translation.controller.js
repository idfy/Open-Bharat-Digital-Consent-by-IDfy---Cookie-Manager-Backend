import { INTERNAL_SERVER_ERROR_DICT } from '../services/constants.js'
import { handleTemplateTranslation } from '../services/language_translation/templates.services.js'
import { LANGUAGES_LIST_MASTER_WITHOUT_ENGLISH } from '../services/language_translation/constants.js'
import get from 'lodash/get.js'

async function translateTemplate(req, res) {
    try {
        const templateId = get(req, 'body.template_id')
        const languages = get(req, 'languages', LANGUAGES_LIST_MASTER_WITHOUT_ENGLISH)
        const modifiedValuesEnglish = get(req, 'body.modified_values', {})
        const userId = get(req, 'current_user.account_id')
        const results = await handleTemplateTranslation(userId, templateId, languages, modifiedValuesEnglish)
        return res.status(results['status_code']).json(results)
    } catch (error) {
        console.log(error)
        return res.status(INTERNAL_SERVER_ERROR_DICT['status_code']).json(INTERNAL_SERVER_ERROR_DICT)
    }
}

export { translateTemplate }
