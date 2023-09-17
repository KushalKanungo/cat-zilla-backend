const AttemptModel = require('../models/attempt')
const ResultModel = require('../models/result')
const AttemptService = require('../services/attemptService')
const myCache = require('../utils/cache')
const ErrorHandeler = require('../utils/errorHandeler')
const attemptSeializer = require('../views/attempt/attempSerializer')
const Status = require('../_enums/status')
const { questionPaperForTest } = require('../services/questionPaperService')
const { logger } = require('../helpers/logger')
const questionPaper = require('../models/questionPaper')

const setResponse = async (req, res, next) => {
    try {
        const { type } = req.body
        if (type === 'question') {
            await setQuestionResponse(req.body)
            logger('Question response saved')
        } else if (type === 'section') {
            await setSectionResponse(req.body)
            logger('Section response saved')
        } else if (type === 'questionPaper') {
            await setQuestionPaperResponse(req.body)
        }
        res.status(201).json({ message: 'Updated successfully' })
    } catch (error) {
        next(error)
    }
}

const setQuestionResponse = async ({
    attemptId,
    sectionId,
    questionId,
    status,
    timeSpent,
    userResponse,
}) => {
    debugger
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
            logger('Cached Result')
            return res.status(200).json(processedResult)
        }

        // myCache.set(req.originalUrl, JSON.stringify(serialized))
        const processed = await processResultAndSave(req)
        res.status(200).json(processed)
    } catch (error) {
        next(error)
    }
}

const getResultForPreview = async (req, res, next) => {
    try {
        const attemptId = req.params.id
        const result = await AttemptModel.findOne({
            _id: attemptId,
            user: req.user._id,
        }).select(['questionPaper', 'sections.section'])
        if (!result) {
            throw new ErrorHandeler('Result not found', 400)
        }
        const serializedPaper = await questionPaperForTest({
            id: result.questionPaper,
            sections: result.sections.map((sec) => String(sec.section)),
            user: req.user,
            forPreview: true,
        })
        logger(serializedPaper)
        return res.status(200).json(serializedPaper)
    } catch (error) {
        next(error)
    }
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

const getTimeline = async (req, res, next) => {
    console.log('id', req.user_id)
    try {
        const count = await ResultModel.find({ user: req.user._id }).count()
        const attempts = await ResultModel.find({
            user: req.user._id,
        })
            .populate({
                path: 'questionPaper',
                populate: 'label',
            })
            .populate({
                path: 'attempt',
                populate: 'createdAt',
            })
        res.status(201).json(attemptSeializer.timeline(attempts, count))
    } catch (err) {
        console.log(err)
        next(err)
    }
}

const processResultAndSave = async (req) => {
    const result = await AttemptService.getResult(req.params.id)
    const serialized = attemptSeializer.attempt(result)
    const processed = new ResultModel({
        ...serialized,
        user: req.user.id,
        attempt: req.params.id,
        questionPaper: result.questionPaper,
    })
    processed.save()
    return processed
}
module.exports = {
    setResponse,
    getResult,
    getAllResults,
    deleteResults,
    getResultForPreview,
    getTimeline,
}
