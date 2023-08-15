require('dotenv').config()
const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
const MONGODB_URI = process.env.MONGODB_URI

const connectDB = () => {
    console.log('connect started')
    mongoose
        .connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'cat_zilla'
        })
        .then(() => {
            console.log('Connected to MongoDB')
        })
        .catch((err) => {
            console.log(err)
        })
}

module.exports = connectDB
