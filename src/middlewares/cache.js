const myCache = require('../utils/cache')

function cacheMiddleware(req, res, next) {
    const cachedData = myCache.get(req.originalUrl)
    if (cachedData) {
        return res.json(JSON.parse(cachedData))
    }

    next()
}

module.exports = { cacheMiddleware }
