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
