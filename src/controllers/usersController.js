const { generateToken } = require('../helpers/jwt')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const ErrorHandler = require('../utils/errorHandeler')

const index = async (req, res) => {
    const allUsers = await User.find({}).select(['email', 'username'])
    res.json({ users: allUsers })
}

const signUp = async (req, res, next) => {
    try {
        const { email, username, password, confirmPassword } = req.body
        if (password !== confirmPassword) {
            console.log('before')
            const error = new ErrorHandler('Passwords do not match', 400)
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

const signIn = async (req, res, next) => {
    try {
        const { email, username, password } = req.query
        const user = await User.find({ email, username }).limit(1)

        if (user.length < 1 || password === undefined) {
            return next(
                new ErrorHandler('Email or Password is incorrect.', 400)
            )
        }
        const isMatch = await bcrypt.compare(password, user[0].password)
        if (isMatch) {
            const token = generateToken({
                id: user[0].id,
                email: user[0].email,
            })
            return res.json({ accessToken: token })
        }
        return next(new ErrorHandler('Email or Password is incorrect.', 400))
    } catch (error) {
        next(error)
    }
}

const test = (req, res) => {
    // res.json({ token: req.headers.authorization.split(' ')[1] })
    res.json({ user: req.user })
}

module.exports = {
    signUp,
    index,
    signIn,
    test,
}
