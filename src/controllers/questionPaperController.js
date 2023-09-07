const Section = require('../models/section')
const Subject = require('../models/subject')
const Area = require('../models/area')
const Topic = require('../models/topic')
const QuestionType = require('../models/questionType')
const Question = require('../models/question')
const QuestionPaper = require('../models/questionPaper')
const QuestionPaperService = require('../services/questionPaperService')
const QuestionPaperSerializer = require('../views/questionPaperSerializer')
const ErrorHandler = require('../utils/errorHandeler')
const { default: mongoose } = require('mongoose')

const addQuestionPaper = async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const { label, questions, description } = req.body
        let easy = 0
        let medium = 0
        let hard = 0
        let unknown = 0
        let savedQuestions = []
        for (const [index, question] of questions.entries()) {
            const temp_ques = await addQuestion(question, index, next)
            savedQuestions.push(temp_ques)
            switch (question.Difficulty.toLowerCase()) {
                case 'easy':
                    easy += 1
                    break
                case 'medium':
                    medium += 1
                    break
                case 'difficult':
                    hard += 1
                    break
                default:
                    unknown += 1
            }
        }

        const questionPaper = new QuestionPaper({
            questions: savedQuestions,
            label,
            description,
            easy,
            medium,
            hard,
            unknown,
        })
        await questionPaper.save()
        res.status(201).json({ message: 'Question paper added successfully. ' })
    } catch (err) {
        await session.abortTransaction()
        console.error(error)
        const error = new ErrorHandler('File is not valid', 400)
        return next(error)
    } finally {
        session.endSession()
    }
}

const getQuestionPaper = async (req, res, next) => {
    try {
        const { page = 1, per = 12, query = '' } = req.query
        const searchQuery =
            query?.length > 0
                ? { label: { $regex: new RegExp(query, 'i') } }
                : {}
        const total = await QuestionPaper.find(searchQuery).count()

        const questionPapers = await QuestionPaper.find(searchQuery)
            .populate({
                path: 'attempts',
                match: { user: req.user._id },
            })
            .skip((page - 1) * per)
            .limit(per)
        res.json(
            QuestionPaperSerializer.questionPaperListing(
                questionPapers,
                per,
                page,
                total
            )
        )
    } catch (error) {
        next(error)
    }
}

const paper = async (req, res, next) => {
    try {
        const serializedData = await QuestionPaperService.questionPaperForTest({
            ...req.body,
            user: req.user,
        })
        res.json(serializedData)
    } catch (error) {
        next(error)
    }
}

// PRIVATE FUNCTIONS

const addQuestion = async (question, index, next) => {
    try {
        const {
            SubjectID,
            SubjectName,
            AreaID,
            AreaName,
            TopicID,
            TopicName,
            ItemType,
            Items,
            Passage,
            Explanation,
            CorrectIndex,
            ItemOptionResponse,
            Points,
            Difficulty,
            NegativePoints,
        } = question
        const questionNo = index + 1

        // Subject
        let subject = await Subject.findOne({ label: SubjectName })
        if (!subject) {
            subject = new Subject({
                label: SubjectName,
                identity_ids: [SubjectID],
            })
            await subject.save()
        } else if (!subject.identity_ids.includes(SubjectID)) {
            await Subject.updateOne(
                { _id: subject._id },
                { $addToSet: { identity_ids: SubjectID } }
            )
        }

        // Area
        let area = await Area.findOne({ label: AreaName })
        if (!area) {
            area = new Area({ label: AreaName, identity_ids: [AreaID] })
            await area.save()
        } else if (!area.identity_ids.includes(AreaID)) {
            await Area.updateOne(
                { _id: area._id },
                { $addToSet: { identity_ids: AreaID } }
            )
        }

        // Topic
        let topic = await Topic.findOne({ label: TopicName })
        if (!topic) {
            topic = new Topic({ label: TopicName, identity_ids: [TopicID] })
            await topic.save()
        } else if (!topic.identity_ids.includes(TopicID)) {
            await Topic.updateOne(
                { _id: topic._id },
                { $addToSet: { identity_ids: TopicID } }
            )
        }

        // Question Type
        let questionType = await QuestionType.findOne({ label: ItemType })
        if (!questionType) {
            questionType = new QuestionType({
                label: ItemType,
            })
            await questionType.save()
        }

        const section = await Section.findOne({
            subject_ids: { $elemMatch: { $in: subject.identity_ids } },
        })

        const options = ItemOptionResponse.map(
            ({ IsCorrect, Options }, index) => ({
                index,
                isCorrect: IsCorrect,
                option: Options,
            })
        )
        let newQuestion = new Question({
            question: Items,
            questionNo,
            correctOption: CorrectIndex,
            marks: Points,
            negativeMarks: NegativePoints,
            explanation: Explanation,
            difficulty: Difficulty,
            passage: Passage,
            options,
            area,
            topic,
            section,
            subject,
            questionType,
        })
        await newQuestion.save()
        return newQuestion
    } catch (err) {
        return next(new Error(err))
    }
}

module.exports = {
    addQuestionPaper,
    getQuestionPaper,
    paper,
}
