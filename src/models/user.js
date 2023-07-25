const mongoose = require('mongoose')
const passwordHasher = require('../helpers/passwordHash')
const uniqueValidator = require('mongoose-unique-validator')

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "can't be blank."],
            match: [/\S+@\S+\.\S+/, 'is invalid'],
            index: true,
            unique: [true, 'already exists'],
        },
        username: {
            type: String,
            index: true,
        },
        password: String,
        salt: String,
    },
    { timestamps: true }
)

/**
 * Mongoose Prehook runs before save
 * It converts password to hash and stores hashed password and salt
 */
UserSchema.pre('save', async function (next) {
    const user = this
    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next()
    // Hash the password
    const [salt, hash] = await passwordHasher.encyptPassword(user.password)
    user.salt = salt
    user.password = hash
    next()
})

module.exports = mongoose.model('Users', UserSchema)
