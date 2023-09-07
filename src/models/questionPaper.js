const mongoose = require('mongoose')
const QuestionModel = require('./question')

const QuestionPaperSchema = new mongoose.Schema(
    {
        label: { type: String, required: true, unique: true },
        questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Questions' }],
        attempts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attempts' }],
        easy: Number,
        medium: Number,
        hard: Number,
        unknown: Number,
        description: String,
    },
    { timestamps: true }
)

// QuestionPaperSchema.pre('findOneAndDelete', async function (doc, next) {
//     const attempt = doc
//     await QuestionModel.deleteMany({  })
//     await Question.updateOne(
//         { _id: attempt.questionPaper },
//         { $pull: { attempts: attempt._id } }
//     )
//     await ResultModel.deleteOne({ attempt: attempt._id })
//     next()
// })

module.exports = mongoose.model('QuestionPapers', QuestionPaperSchema)
