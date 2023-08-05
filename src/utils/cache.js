const NodeCache = require('node-cache')
const myCache = new NodeCache({
    stdTTL: 3000,
    errorOnMissing: true,
    maxKeys: 1000,
})

module.exports = myCache
