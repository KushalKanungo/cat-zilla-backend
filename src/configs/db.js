require('dotenv').config()
const mongoose = require('mongoose')
const { logger } = require('../helpers/logger')

// eslint-disable-next-line no-undef
const MONGODB_URI = process.env.MONGODB_URI

const connectDB = () => {
    logger('<====Connecting to db started.===>')
    mongoose
        .connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'cat_zilla',
        })
        .then(() => {
            logger('<============Connected to MongoDB============>')
        })
        .catch((err) => {
            console.log(err)
        })
}

module.exports = connectDB
