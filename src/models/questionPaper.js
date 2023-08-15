const mongoose = require('mongoose')

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
module.exports = mongoose.model('QuestionPapers', QuestionPaperSchema)
