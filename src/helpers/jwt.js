require('dotenv').config()
const jwt = require('jsonwebtoken')

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRY_TIME,
    })
}

const decryptToken = (token) => {
    const bearerRemoved = token.split(' ')[1]
    const decoded = jwt.verify(bearerRemoved, process.env.TOKEN_SECRET)
    return decoded
}

module.exports = {
    generateToken,
    decryptToken,
}
