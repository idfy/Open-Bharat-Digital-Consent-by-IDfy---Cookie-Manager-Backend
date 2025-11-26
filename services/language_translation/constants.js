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

// Master map of language codes to English labels
import { ENGLISH_ENUM_VALUE } from '../constants.js'
const LANGUAGES_MAP_MASTER = {
    'en': 'English (English)',
    'as': 'Assamese (অসমীয়া)',
    'bn': 'Bengali (বাংলা)',
    'br': "Bodo (बर')", // eslint-disable-line quotes
    'doi': 'Dogri (डोगरी)',
    'gom': 'Konkani (कोंकणी)',
    'gu': 'Gujarati (ગુજરાતી)',
    'hi': 'Hindi (हिंदी)',
    'kn': 'Kannada (ಕನ್ನಡ)',
    'mai': 'Maithili (मैथिली)',
    'ml': 'Malayalam (മലയാളം)',
    'mni-Mtei': 'Manipuri (ꯃꯅꯤꯄꯨꯔꯤꯗꯥ ꯂꯩꯕꯥ꯫)',
    'mr': 'Marathi (मराठी)',
    'ne': 'Nepali (नेपाली)',
    'or': 'Oriya (ଓଡିଆ)',
    'pa': 'Punjabi (ਪੰਜਾਬੀ)',
    'sa': 'Sanskrit (संस्कृत)',
    'sd': 'Sindhi (سنڌي)',
    'st': 'Santhali (ᱥᱚᱱᱛᱷᱟᱞᱤ)',
    'ta': 'Tamil (தமிழ்)',
    'te': 'Telugu (తెలుగు)',
    'ur': 'Urdu (اردو)',
    'ks': 'Kashmiri (कश्मीरी)'
}
// Map of language codes to native script labels
const TRANSLATED_LANGUAGES_MAP = {
    'en': 'English',
    'as': 'অসমীয়া',
    'bn': 'বাংলা',
    'br': "बर'", // eslint-disable-line quotes
    'doi': 'डोगरी',
    'gom': 'कोंकणी',
    'gu': 'ગુજરાતી',
    'hi': 'हिंदी',
    'kn': 'ಕನ್ನಡ',
    'mai': 'मैथिली',
    'ml': 'മലയാളം',
    'mni-Mtei': 'ꯃꯅꯤꯄꯨꯔꯤꯗꯥ ꯂꯩꯕꯥ꯫',
    'mr': 'मराठी',
    'ne': 'नेपाली',
    'or': 'ଓଡିଆ',
    'pa': 'ਪੰਜਾਬੀ',
    'sa': 'संस्कृत',
    'sd': 'سنڌي',
    'st': 'ᱥᱚᱱᱛᱷᱟᱞᱤ',
    'ta': 'தமிழ்',
    'te': 'తెలుగు',
    'ur': 'اردو',
    'ks': 'कश्मीरी'
}

const STATIC_BANNER_TEXT_TRANSLATIONS = {
    'en': {
        'NECESSARY': 'Necessary',
        'ANALYTICS': 'Analytics',
        'MARKETING': 'Marketing',
        'FUNCTIONAL': 'Functional',
        'Cookies': 'Cookies',
        'Name': 'Name',
        'Description': 'Descriptions',
        'Host': 'Host',
        'View Cookies': 'View Cookies',
        'Session': 'Session'
    },
    'as': {
        'NECESSARY': 'প্ৰয়োজনীয়',
        'ANALYTICS': 'এনালিটিক্স',
        'MARKETING': 'মাৰ্কেটিং',
        'FUNCTIONAL': 'ফাংকশ্যনেল',
        'Cookies': 'কুকিজ',
        'Name': 'নাম',
        'Description': 'বিৱৰণ',
        'Host': 'হোস্ট',
        'View Cookies': 'কুকিজ চাওক',
        'Session': 'অধিবেশন'
    },
    'bn': {
        'NECESSARY': 'প্রয়োজনীয়',
        'ANALYTICS': 'অ্যানালিটিক্স',
        'MARKETING': 'মার্কেটিং',
        'FUNCTIONAL': 'ফাংশনাল',
        'Cookies': 'কুকিজ',
        'Name': 'নাম',
        'Description': 'বিবরণ',
        'Host': 'হোস্ট',
        'View Cookies': 'কুকিজ',
        'Session': 'অধিবেশন'
    },
    'doi': {
        'NECESSARY': 'ज़रूरी',
        'ANALYTICS': 'एनालिटिक्स',
        'MARKETING': 'मार्केटिंग',
        'FUNCTIONAL': 'फंक्शनल',
        'Cookies': 'कुकीज़',
        'Name': 'नांव',
        'Description': 'वर्णन',
        'Host': 'होस्ट',
        'View Cookies': 'कुकीज़ देखो',
        'Session': 'सत्र'
    },
    'gom': {
        'NECESSARY': 'गरजेचें',
        'ANALYTICS': 'अ‍ॅनालिटिक्स',
        'MARKETING': 'मार्केटिंग',
        'FUNCTIONAL': 'फंक्शनल',
        'Cookies': 'कुकीज',
        'Name': 'नाव',
        'Description': 'वर्णन',
        'Host': 'होस्ट',
        'View Cookies': 'कुकीज पहा',
        'Session': 'अधिवेशन'
    },
    'gu': {
        'NECESSARY': 'જરૂરી',
        'ANALYTICS': 'એનાલિટિક્સ',
        'MARKETING': 'માર્કેટિંગ',
        'FUNCTIONAL': 'ફંક્શનલ',
        'Cookies': 'કુકીઝ',
        'Name': 'નામ',
        'Description': 'વર્ણન',
        'Host': 'હોસ્ટ',
        'View Cookies': 'કુકીઝ જુઓ',
        'Session': 'સત્ર'
    },
    'hi': {
        'NECESSARY': 'आवश्यक',
        'ANALYTICS': 'एनालिटिक्स',
        'MARKETING': 'मार्केटिंग',
        'FUNCTIONAL': 'फंक्शनल',
        'Cookies': 'कुकीज़',
        'Name': 'नाम',
        'Description': 'विवरण',
        'Host': 'होस्ट',
        'View Cookies': 'कुकीज़ देखें',
        'Session': 'सत्र'
    },
    'kn': {
        'NECESSARY': 'ಅಗತ್ಯವಿರುವ',
        'ANALYTICS': 'ಅನಾಲಿಟಿಕ್ಸ್',
        'MARKETING': 'ಮಾರ್ಕೆಟಿಂಗ್',
        'FUNCTIONAL': 'ಫಂಕ್ಷನಲ್',
        'Cookies': 'ಕುಕೀಸ್',
        'Name': 'ಹೆಸರು',
        'Description': 'ವಿವರಣೆ',
        'Host': 'ಹೊಸ್ಟ್',
        'View Cookies': 'ಕುಕೀಸ್ ನೋಡಿ',
        'Session': 'ಅಧಿವೇಶನ'
    },
    'mai': {
        'NECESSARY': 'आवश्यक',
        'ANALYTICS': 'एनालिटिक्स',
        'MARKETING': 'मार्केटिंग',
        'FUNCTIONAL': 'फंक्शनल',
        'Cookies': 'कुकीज़',
        'Name': 'नाम',
        'Description': 'वर्णन',
        'Host': 'होस्ट',
        'View Cookies': 'कुकीज़ देखू',
        'Session': 'सत्र'
    },
    'ml': {
        'NECESSARY': 'ആവശ്യമായത്',
        'ANALYTICS': 'അനാലിറ്റിക്സ്',
        'MARKETING': 'മാർക്കറ്റിംഗ്',
        'FUNCTIONAL': 'ഫംഗ്ഷണൽ',
        'Cookies': 'കുക്കീസ്',
        'Name': 'പേര്',
        'Description': 'വിവരണം',
        'Host': 'ഹോസ്റ്റ്',
        'View Cookies': 'കുക്കീസ് കാണുക',
        'Session': 'സമ്മേളനം'
    },
    'mni-Mtei': {
        'NECESSARY': 'ꯑꯃꯨꯡ ꯆꯠꯅꯕꯥ',
        'ANALYTICS': 'অ্যানালিটিক্স',
        'MARKETING': 'মাৰ্কেটিং',
        'FUNCTIONAL': 'ফাংকশ্যনেল',
        'Cookies': 'কুকিজ',
        'Name': 'মিং',
        'Description': 'ꯋꯥꯡꯗꯣꯜ',
        'Host': 'হোস্ট',
        'View Cookies': 'কুকিজ থৌবা',
        'Session': 'অধিবেশন'
    },
    'mr': {
        'NECESSARY': 'आवश्यक',
        'ANALYTICS': 'अ‍ॅनालिटिक्स',
        'MARKETING': 'मार्केटिंग',
        'FUNCTIONAL': 'फंक्शनल',
        'Cookies': 'कुकीज',
        'Name': 'नाव',
        'Description': 'वर्णन',
        'Host': 'होस्ट',
        'View Cookies': 'कुकीज पहा',
        'Session': 'सत्र'
    },
    'ne': {
        'NECESSARY': 'आवश्यक',
        'ANALYTICS': 'एनालिटिक्स',
        'MARKETING': 'मार्केटिंग',
        'FUNCTIONAL': 'फंक्शनल',
        'Cookies': 'कुकीज',
        'Name': 'नाम',
        'Description': 'वर्णन',
        'Host': 'होस्ट',
        'View Cookies': 'कुकीहरू हेर्नुहोस्',
        'Session': 'अधिवेशन'
    },
    'or': {
        'NECESSARY': 'ଆବଶ୍ୟକ',
        'ANALYTICS': 'ଏନାଲିଟିକ୍ସ',
        'MARKETING': 'ମାର୍କେଟିଙ୍ଗ',
        'FUNCTIONAL': 'ଫଂକ୍ସନଲ',
        'Cookies': 'କୁକିଜ୍',
        'Name': 'ନାମ',
        'Description': 'ବିବରଣୀ',
        'Host': 'ହୋଷ୍ଟ',
        'View Cookies': 'କୁକିଜ୍ ଦେଖନ୍ତୁ',
        'Session': 'ଅଧିବେଶନ'
    },
    'pa': {
        'NECESSARY': 'ਲਾਜ਼ਮੀ',
        'ANALYTICS': 'ਐਨਾਲਿਟਿਕਸ',
        'MARKETING': 'ਮਾਰਕੇਟਿੰਗ',
        'FUNCTIONAL': 'ਫੰਕਸ਼ਨਲ',
        'Cookies': 'ਕੁਕੀਜ਼',
        'Name': 'ਨਾਂ',
        'Description': 'ਵੇਰਵਾ',
        'Host': 'ਹੋਸਟ',
        'View Cookies': 'ਕੁਕੀਜ਼ ਵੇਖੋ',
        'Session': 'ਸੈਸ਼ਨ'
    },
    'sa': {
        'NECESSARY': 'आवश्यकम्',
        'ANALYTICS': 'एनालिटिक्स',
        'MARKETING': 'मार्केटिङग्',
        'FUNCTIONAL': 'फङ्क्शनल्',
        'Cookies': 'कूकीस्',
        'Name': 'नाम',
        'Description': 'विवरणम्',
        'Host': 'होस्ट्',
        'View Cookies': 'कूकीन्',
        'Session': 'सत्रम्'
    },
    'sd': {
        'NECESSARY': 'ضروري',
        'ANALYTICS': 'اينالٽڪس',
        'MARKETING': 'مارڪيٽنگ',
        'FUNCTIONAL': 'فنڪشنل',
        'Cookies': 'ڪوڪيز',
        'Name': 'نالو',
        'Description': 'وضاحت',
        'Host': 'ھوسٽ',
        'View Cookies': 'ڪوڪيزڏسو',
        'Session': 'سيشن'
    },
    'ta': {
        'NECESSARY': 'தேவையான',
        'ANALYTICS': 'அனாலிடிக்ஸ்',
        'MARKETING': 'மார்கெட்டிங்',
        'FUNCTIONAL': 'ஃபங்க்ஷனல்',
        'Cookies': 'கூக்கீஸ்',
        'Name': 'பெயர்',
        'Description': 'விளக்கம்',
        'Host': 'ஹோஸ்ட்',
        'View Cookies': 'கூக்கீஸ்களை பார்வையிடு',
        'Session': 'அமர்வு'
    },
    'te': {
        'NECESSARY': 'అవసరం',
        'ANALYTICS': 'అనాలిటిక్స్',
        'MARKETING': 'మార్కెటింగ్',
        'FUNCTIONAL': 'ఫంక్షనల్',
        'Cookies': 'కుకీస్',
        'Name': 'పేరు',
        'Description': 'వివరణ',
        'Host': 'హోస్ట్',
        'View Cookies': 'కుకీస్ చూడండి',
        'Session': 'సత్రం'
    },
    'ur': {
        'NECESSARY': 'ضروری',
        'ANALYTICS': 'اینالیٹکس',
        'MARKETING': 'مارکیٹنگ',
        'FUNCTIONAL': 'فنکشنل',
        'Cookies': 'کوکیز',
        'Name': 'نام',
        'Description': 'تفصیل',
        'Host': 'ہوسٹ',
        'View Cookies': 'کوکیزدیکھیں',
        'Session': 'اجلاس'
    },
    'br': {
        'NECESSARY': 'नांग’लाबाय',
        'ANALYTICS': 'एनालिटिक्स',
        'MARKETING': 'मार्केटिंग',
        'FUNCTIONAL': 'फंक्शनल',
        'Cookies': 'कुकिज',
        'Name': 'मुंखो',
        'Description': 'बिसारनाय',
        'Host': 'होस्ट',
        'View Cookies': 'कुकिज दंहोनाय',
        'Session': 'सेसन'
    },
    'st': {
        'NECESSARY': 'ᱦᱚᱞ ᱠᱚ',
        'ANALYTICS': 'ᱮᱱᱟᱞᱤᱴᱤᱠᱥ',
        'MARKETING': 'ᱢᱟᱨᱠᱮᱴᱤᱝ',
        'FUNCTIONAL': 'ᱯᱷᱟᱱᱠᱥᱚᱱᱚᱞ',
        'Cookies': 'ᱠᱩᱠᱤᱥ',
        'Name': 'ᱧᱩᱛᱩᱢ',
        'Description': 'ᱵᱤᱥᱟᱨᱮᱱ',
        'Host': 'ᱦᱚᱥᱴ',
        'View Cookies': 'ᱠᱩᱠᱤᱥ ᱧᱮᱞ',
        'Session': 'ᱥᱮᱥᱤᱭᱚᱱ'
    },
    'ks': {
        'NECESSARY': 'لازمی',
        'ANALYTICS': 'اینالیٹکس',
        'MARKETING': 'مارکیٹنگ',
        'FUNCTIONAL': 'فنکشنل',
        'Cookies': 'کوکیز',
        'Name': 'ناو',
        'Description': 'وُضاحت',
        'Host': 'ہوسٹ',
        'View Cookies': 'کوکیز وُچھ',
        'Session': 'سیشن'
    }
}
// Master supported languages list (sorted)
const LANGUAGES_LIST_MASTER_WITHOUT_ENGLISH = Object.keys(LANGUAGES_MAP_MASTER).filter(
    (lang) => lang !== ENGLISH_ENUM_VALUE
)
const LANGUAGES_LIST_MASTER = [ENGLISH_ENUM_VALUE, ...LANGUAGES_LIST_MASTER_WITHOUT_ENGLISH]
// Languages handled by Language Engine
// const LANGUAGE_ENGINE_LIST = ['br', 'doi', 'ks', 'st', 'mni-Mtei', 'mr', 'hi']
const LANGUAGE_ENGINE_LIST = []
// Calculate Languages handled by Google Translate by removing Language Engine languages from the master list
const GT_LIST = LANGUAGES_LIST_MASTER.filter((lang) => !LANGUAGE_ENGINE_LIST.includes(lang))

export {
    LANGUAGE_ENGINE_LIST,
    GT_LIST,
    LANGUAGES_MAP_MASTER,
    LANGUAGES_LIST_MASTER,
    TRANSLATED_LANGUAGES_MAP,
    LANGUAGES_LIST_MASTER_WITHOUT_ENGLISH,
    STATIC_BANNER_TEXT_TRANSLATIONS
}
