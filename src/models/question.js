const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const QuestionSchema = new mongoose.Schema(
    {
        question: String,
        difficulty: String,
        questionType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'QuestionTypes',
        },
        section: { type: mongoose.Schema.Types.ObjectId, ref: 'Sections' },
        subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subjects' },
        area: { type: mongoose.Schema.Types.ObjectId, ref: 'Areas' },
        topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topics' },
        options: [{ index: Number, option: String, isCorrect: Boolean }],
        explanation: String,
        correctOption: Number,
        marks: Number,
        negativeMarks: Number,
        passage: String,
    },
    { timestamps: true }
)

module.exports = mongoose.model('Questions', QuestionSchema)
