const myCache = require('../utils/cache')

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function cacheMiddleware(req, res, next) {
    // const cachedData = myCache.get(req.originalUrl)
    const cachedData = false
    await sleep(1600)
    if (cachedData) {
        return res.json(JSON.parse(cachedData))
    }

    next()
}

module.exports = { cacheMiddleware }
