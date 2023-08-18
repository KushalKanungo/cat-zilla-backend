require('dotenv').config()
const myCache = require('../utils/cache')

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function cacheMiddleware(req, res, next) {
    if (process.env.IS_CACHING_ENABLED !== 'yes') {
        return next()
    }

    const cachedData = myCache.get(req.originalUrl)
    if (cachedData) {
        return res.json(JSON.parse(cachedData))
    }

    next()
}

module.exports = { cacheMiddleware }
