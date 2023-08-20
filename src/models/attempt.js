const mongoose = require('mongoose')
const StatusEnum = require('../_enums/status')
const QuestionPaperModel = require('./questionPaper')
const ResultModel = require('./result')
const { attempt } = require('../views/attempt/attempSerializer')
const ErrorHandler = require('../utils/errorHandeler')
const { logger } = require('../helpers/logger')

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
        questionPaper: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'QuestionPapers',
            required: true,
        },
        sections: [SectionSchema],
        startTime: Date,
        status: { type: String, default: StatusEnum.IN_PROGRESS },
        timeSpent: { type: Number, default: 0 },
    },
    { timestamps: true }
)

AttemptSchema.pre('findOneAndUpdate', async function (next) {
    try {
        const docToUpdate = await this.model.findOne(this.getQuery())
        logger('Attempt PRE SAVE ====> Checking passed paper is in progress.')
        if (docToUpdate.status === StatusEnum.IN_PROGRESS) {
            return next()
        }
        return next(new ErrorHandler('Paper has already been submitted.', 400))
    } catch (err) {
        return next(err)
    }
})

AttemptSchema.post('save', async function (doc, next) {
    const attempt = doc
    await QuestionPaperModel.updateOne(
        { _id: attempt.questionPaper },
        { $push: { attempts: attempt._id } }
    )
    next()
})

AttemptSchema.post('findOneAndDelete', async function (doc, next) {
    const attempt = doc
    await QuestionPaperModel.updateOne(
        { _id: attempt.questionPaper },
        { $pull: { attempts: attempt._id } }
    )
    await ResultModel.deleteOne({ attempt: attempt._id })
    next()
})

AttemptSchema.methods.isInProgress = function () {
    return this.status === StatusEnum.IN_PROGRESS
}

module.exports = mongoose.model('Attempts', AttemptSchema)
