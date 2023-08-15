const QuestionModel = require('../models/question')

const getQuestionById = async (req, res, next) => {
    const question = await QuestionModel.findById(req.params.id).populate(
        'section subject questionType',
    )

    res.status(200).json(question)
}

module.exports = { getQuestionById }
