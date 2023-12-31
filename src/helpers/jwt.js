require('dotenv').config()
const jwt = require('jsonwebtoken')

const generateToken = (payload) => {
    if (process.env.EXPIRE_TOKEN === 'yes')
        return jwt.sign(payload, process.env.TOKEN_SECRET, {
            expiresIn: process.env.TOKEN_EXPIRY_TIME,
        })
    return jwt.sign(payload, process.env.TOKEN_SECRET)
}

const decryptToken = (token) => {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    return decoded
}

module.exports = {
    generateToken,
    decryptToken,
}
