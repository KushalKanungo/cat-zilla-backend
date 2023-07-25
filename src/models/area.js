const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const AreaSchema = new mongoose.Schema(
    {
        label: {
            type: String,
            required: true,
            unique: true,
        },
        description: String,
        identity_ids: [Number],
    },
    { timestamps: true }
)

module.exports = mongoose.model('Areas', AreaSchema)
