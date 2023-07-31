const mongoose = require('mongoose')
const StatusEnum = require('../_enums/status')

const QuestionSchema = new mongoose.Schema(
    {
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Questions',
            required: true,
        },
        userResponse: Number,
        timeSpent: { type: Number, default: 0 },
        status: {
            type: String,
            default: StatusEnum.NOT_VISITED,
        },
    },
    { _id: false }
)

const SectionSchema = new mongoose.Schema(
    {
        section: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sections',
            required: true,
        },
        questions: [QuestionSchema],
        timeSpent: { type: Number, default: 0 },
        status: { type: String, default: StatusEnum.NOT_STARTED },
    },
    { _id: false }
)

const AttemptSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },
        quesionPaper: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'QuestionPapers',
            required: true,
        },
        sections: [SectionSchema],
        startTime: Date,
        status: { type: String, default: StatusEnum.NOT_STARTED },
        timeSpent: { type: Number, default: 0 },
    },
    { timestamps: true }
)
module.exports = mongoose.model('Attemtps', AttemptSchema)
