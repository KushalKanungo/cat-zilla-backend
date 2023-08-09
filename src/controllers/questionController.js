const QuestionModel = require('../models/question')

const getQuestionById = async (req, res, next) => {
    console.log(req.params.id)
    const question = await QuestionModel.findById(req.params.id).populate(
        'section subject questionType',
    )
    console.log(question.questionType)

    res.status(200).json(question)
}

module.exports = { getQuestionById }
