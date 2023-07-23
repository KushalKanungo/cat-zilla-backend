const User = require('../models/user')
const { decryptToken } = require('../helpers/jwt')

const setCurrentUser = async (req, res, next) => {
    try {
        const decoded = decryptToken(req.headers.authorization)
        if (decoded) {
            const user = await User.findOne({ _id: decoded.id })
            req.user = user
            next()
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    setCurrentUser,
}
