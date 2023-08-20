const mongoose = require('mongoose')

const ResultSchema = new mongoose.Schema(
    {
        questionPaper: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'QuestionPapers',
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
        },
        attempt: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Attempts',
        },
        total: Number,
        correct: Number,
        wrong: Number,
        unanswered: Number,
        maximumMarks: Number,
        status: String,
        questions: [
            {
                id: { type: mongoose.Schema.Types.ObjectId, ref: 'Questions' },
                isCorrect: Boolean,
                timeSpent: Number,
                userResponse: Number,
                marks: Number,
                questionType: String,
            },
        ],
        sections: [
            {
                sectionId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Sections',
                },
                correct: Number,
                wrong: Number,
                unanswered: Number,
                maximumMarks: Number,
            },
        ],
    },
    { timestamps: true, strict: false }
)

module.exports = mongoose.model('Results', ResultSchema)
