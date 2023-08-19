const AttemptModel = require('../models/attempt')
const ResultModel = require('../models/result')
const AttemptService = require('../services/attemptService')
const myCache = require('../utils/cache')
const ErrorHandeler = require('../utils/errorHandeler')
const attemptSeializer = require('../views/attempt/attempSerializer')
const Status = require('../_enums/status')

const setResponse = async (req, res, next) => {
    const { type } = req.body
    if (type === 'question') {
        await setQuestionResponse(req.body)
        console.log('Question response saved')
    } else if (type === 'section') {
        await setSectionResponse(req.body)
        console.log('Section response saved')
    } else if (type === 'questionPaper') {
        await setQuestionPaperResponse(req.body)
    }
    res.status(201).json({ message: 'Updated successfully' })
}

const setQuestionResponse = async ({
    attemptId,
    sectionId,
    questionId,
    status,
    timeSpent,
    userResponse,
}) => {
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
}

const setSectionResponse = async ({ attemptId, sectionId, timeSpent }) => {
    await AttemptModel.findOneAndUpdate(
        { _id: attemptId },
        {
            $set: {
                'sections.$[section].timeSpent': timeSpent,
                'sections.$[section].status': Status.DONE,
            },
        },
        {
            arrayFilters: [{ 'section.section': sectionId }],
        }
    )
}

const setQuestionPaperResponse = async ({ attemptId }) => {
    await AttemptModel.findOneAndUpdate(
        { _id: attemptId },
        { $set: { status: Status.DONE } }
    )
}

const getResult = async (req, res, next) => {
    try {
        const processedResult = await ResultModel.findOne({
            attempt: req.params.id,
        })
        if (processedResult) {
            console.log('cached')
            return res.status(200).json(processedResult)
        }
        const result = await AttemptService.getResult(req.params.id)
        const serialized = attemptSeializer.attempt(result)
        const processed = new ResultModel({
            ...serialized,
            user: req.user.id,
            attempt: req.params.id,
            questionPaper: result.questionPaper,
        })
        processed.save()
        // myCache.set(req.originalUrl, JSON.stringify(serialized))
        res.status(200).json(serialized)
    } catch (error) {
        next(error)
    }
}

const getResultForPreview = async (req, res, next) => {
    let processedResult = await ResultModel.findOne({
        attempt: req.params.id,
    })
        .populate({ path: 'questions', populate: 'id' })
        .populate({ path: 'sections', populate: 'sectionId' })
        .exec()

    processedResult = processedResult.toJSON()
    processedResult.questions = processedResult.questions.map((ques) => {
        let newObj = { ...ques.id, ...ques }
        delete newObj.id
        return newObj
    })
    processedResult.sections = processedResult.sections.map((sec) => {
        console.log(sec.sectionId)
        let newObj = { ...sec.sectionId, ...sec }
        delete newObj.sectionId
        // console.log(newObj.sectionId)
        return newObj
    })
    return res.status(200).json(processedResult)
}

const getAllResults = async (req, res, next) => {
    try {
        const { page = 1, per = 12 } = req.query
        const total = await AttemptModel.find({ user: req.user }).count()

        const questions = await AttemptModel.find({ user: req.user })
            .populate(['questionPaper'])
            .sort('-createdAt')
            .skip((page - 1) * per)
            .limit(per)
        res.json(attemptSeializer.attempListing(questions, per, page, total))
    } catch (error) {
        next(error)
    }
}

const deleteResults = async (req, res, next) => {
    try {
        await AttemptModel.findOneAndDelete({ _id: req.params.id })
        res.status(201).json({ message: 'Deleted Successfully' })
    } catch (error) {
        return next(error)
    }
}
module.exports = {
    setResponse,
    getResult,
    getAllResults,
    deleteResults,
    getResultForPreview,
}
