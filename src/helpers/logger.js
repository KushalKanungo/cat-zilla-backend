require('dotenv').config()

const logger = (...data) => {
    if (process.env.ENVIRONMENT === 'dev') {
        console.warn(`\n${data.join(' ')}\n`)
    }
}

module.exports = { logger }
