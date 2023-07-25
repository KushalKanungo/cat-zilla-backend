const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const QuestionType = new mongoose.Schema(
    {
        label: { type: String, required: true, unique: true },
        description: String,
    },
    { timestamps: true }
)

module.exports = mongoose.model('QuestionTypes', QuestionType)
