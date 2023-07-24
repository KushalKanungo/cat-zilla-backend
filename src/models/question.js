const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    _id: new mongoose.Types.ObjectId(),
    question: String,
    options: [
        {
            option: String,
            isCorrect: Boolean,
        },
    ],
    answer: String,
})

const QuestionPaperSchema = new mongoose.Schema({
    questions: [
        {
            section: {},
        },
    ],
})

module.exports = mongoose.model('QuestionPaper', QuestionPaperSchema)
