const User = require('../models/user')

const signUp = async (req, res, next) => {
    try {
        const { email, username, password, confirmPassword } = req.body
        if (password !== confirmPassword) {
            const error = new Error('Passwords do not match')
            return next(error)
        }
        let newUser = new User({
            email,
            password,
            username,
        })
        await newUser.save()
        res.json({ newUser })
    } catch (err) {
        next(err)
    }
}

const index = async (req, res, next) => {
    const allUsers = await User.find({}).select(['email', 'username'])
    res.json({ users: allUsers })
}

module.exports = {
    signUp,
    index,
}
