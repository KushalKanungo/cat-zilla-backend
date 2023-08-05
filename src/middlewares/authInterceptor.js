const User = require('../models/user')
const { generateToken, decryptToken } = require('../helpers/jwt')
const jwt = require('jsonwebtoken')
const ErrorHandler = require('../utils/errorHandeler')

const setCurrentUser = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            const err = new ErrorHandler('You are not authorized', 400)
            next(err)
        }
        var token = req.headers.authorization.split(' ')[1]
        const decoded = decryptToken(token)
        if (decoded) {
            const user = await User.findOne({ _id: decoded.id })
            req.user = user
            console.log(user.email)
            next()
        }
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            const newToken = refreshExpiredToken(token)
            return res.status(200).json({ accessToken: newToken })
        } else if (err instanceof jwt.JsonWebTokenError) {
            return next(new ErrorHandler('You are not authorized', 401))
        }
        return next(err)
    }
}

const refreshExpiredToken = (expiredToken) => {
    let decoded = jwt.decode(expiredToken)
    return generateToken({
        id: decoded.id,
        email: decoded.email,
    })
}

module.exports = {
    setCurrentUser,
}
