const Section = require('../models/section')
const Subject = require('../models/subject')
const Area = require('../models/area')
const Topic = require('../models/topic')
const QuestionType = require('../models/questionType')
const Question = require('../models/question')
const QuestionPaper = require('../models/questionPaper')

const addQuestionPaper = async (req, res, next) => {
    try {
        const { label, questions, description } = req.body
        let savedQuestions = []
        for (const question of questions) {
            const temp_ques = await addQuestion(question, next)
            savedQuestions.push(temp_ques)
        }

        const questionPaper = new QuestionPaper({
            questions: savedQuestions,
            label,
            description,
        })
        await questionPaper.save()
        res.status(201).json({ message: 'Question paper added successfully. ' })
    } catch (err) {
        return next(err)
    }
}

const getQuestionPaper = async (req, res, next) => {
    try {
        const questions = await QuestionPaper.findOne({})
            .populate('questions')
            .populate({
                path: 'questions',
                populate: [{ path: 'subject' }],
            })
        console.log(questions)
        res.json(questions)
    } catch (error) {
        next(error)
    }
}

const addQuestion = async (question, next) => {
    try {
        const { SubjectID, SubjectName } = question
        const { AreaID, AreaName } = question
        const { TopicID, TopicName } = question
        const { ItemType } = question
        const {
            Items,
            Passage,
            Explanation,
            CorrectIndex,
            ItemOptionResponse,
            Points,
            Difficulty,
            NegativePoints,
        } = question

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
            console.log(ItemType)
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
        // console.log(options)
        let newQuestion = new Question({
            question: Items,
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
        // console.log(newQuestion._id)
        return newQuestion
    } catch (err) {
        return next(new Error(err))
    }
}

module.exports = {
    addQuestionPaper,
    getQuestionPaper,
}
