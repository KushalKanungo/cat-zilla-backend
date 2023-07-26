const mongoose = require('mongoose')

const QuestionPaperSchema = new mongoose.Schema(
    {
        sections: [
            {
                section: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Sections',
                    required: true,
                },
                questions: [
                    {
                        quesion: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: 'Questions',
                            required: true,
                        },
                        userResponse: Number,
                        timeTaken: Number,
                    },
                ],
            },
        ],
        timeTake: Number,
    },
    { timestamps: true }
)
module.exports = mongoose.model('QuestionPaper', QuestionPaperSchema)
