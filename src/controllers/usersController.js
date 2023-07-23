const { generateToken } = require('../helpers/jwt')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const index = async (req, res, next) => {
    const allUsers = await User.find({}).select(['email', 'username'])
    res.json({ users: allUsers })
}

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

const signIn = async (req, res, next) => {
    const { email, username, password } = req.query
    const user = await User.find({ email, username }).limit(1)

    if (user.length < 1 || password === undefined) {
        res.status(401).json({ error: 'User not found' })
        return
    }
    const isMatch = await bcrypt.compare(password, user[0].password)
    if (isMatch) {
        const token = generateToken({ id: user[0].id, email: user[0].email })
        res.json({ accessToken: token })
        return
    }
    res.status(402).json({ error: 'Email or Password is incorrect.' })
}

const test = async (req, res, next) => {
    // res.json({ token: req.headers.authorization.split(' ')[1] })
    res.json({ user: req.user })
}

module.exports = {
    signUp,
    index,
    signIn,
    test,
}
