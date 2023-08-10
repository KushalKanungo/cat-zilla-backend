const AttemptModel = require('../models/attempt')
const StatusEnum = require('../_enums/status')
const AttemptService = require('../services/attemptService')
const myCache = require('../utils/cache')
const ErrorHandeler = require('../utils/errorHandeler')
const attemptSeializer = require('../views/attempt/attempSerializer')

const getFirstAttemptedQuestion = async (req, res, next) => {
    const {
        attemptId,
        sectionId,
        questionId,
        status,
        timeSpent,
        userResponse,
    } = req.body

    await AttemptModel.findOneAndUpdate(
        { _id: attemptId },
        {
            $set: {
                'sections.$[section].questions.$[question].userResponse':
                    userResponse,
                'sections.$[section].questions.$[question].status': status,
                'sections.$[section].questions.$[question].timeSpent':
                    timeSpent,
            },
        },
        {
            arrayFilters: [
                { 'section.questions.question': questionId },
                { 'question.question': questionId },
            ],
        }
    )
    res.status(200).json({ message: 'Answer updated successfully' })
}

const getResult = async (req, res, next) => {
    try {
        const result = await AttemptService.getResult(req.params.id)
        console.log(result)
        const serialized = attemptSeializer.attempt(result)
        myCache.set(req.originalUrl, JSON.stringify(serialized))
        res.status(200).json(serialized)
    } catch (error) {
        const err = new ErrorHandeler(error.message, 500)
        next(err)
    }
}

module.exports = { getFirstAttemptedQuestion, getResult }
