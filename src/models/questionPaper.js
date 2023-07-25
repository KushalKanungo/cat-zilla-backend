const mongoose = require('mongoose')

const QuestionPaperSchema = new mongoose.Schema(
    {
        label: { type: String, required: true, unique: true },
        questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Questions' }],
        description: String,
    },
    { timestamps: true }
)
module.exports = mongoose.model('QuestionPaper', QuestionPaperSchema)
