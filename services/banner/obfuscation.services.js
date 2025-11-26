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

import JavaScriptObfuscator from 'javascript-obfuscator'
import { OBFUSCATE_JS_FILE } from '../constants.js'
function obfuscate(stringifiedJsFile) {
    const obfuscationResult = JavaScriptObfuscator.obfuscate(stringifiedJsFile, {
        compact: true,
        controlFlowFlattening: false,
        controlFlowFlatteningThreshold: 1,
        simplify: true,
        stringArrayShuffle: true,
        splitStrings: false,
        stringArrayThreshold: 0.5
    })
    const jsContent = OBFUSCATE_JS_FILE ? obfuscationResult.getObfuscatedCode() : stringifiedJsFile
    return jsContent
}
export { obfuscate }
