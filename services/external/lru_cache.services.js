// Simple in-memory LRU cache
const jsFileCache = new Map() // key: bannerId, value: fileContent

function setCache(key, value) {
    if (jsFileCache.has(key)) {
        jsFileCache.delete(key) // refresh position
    }
    jsFileCache.set(key, value)

    // Evict oldest entry if size > 3
    if (jsFileCache.size > 3) {
        const oldestKey = jsFileCache.keys().next().value
        jsFileCache.delete(oldestKey)
    }
}

function getCache(key) {
    if (!jsFileCache.has(key)) {
        return null
    }

    // refresh to maintain LRU
    const val = jsFileCache.get(key)
    jsFileCache.delete(key)
    jsFileCache.set(key, val)
    return val
}
export { setCache, getCache }
