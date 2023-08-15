const AttemptModel = require('../models/attempt')
const mongoose = require('mongoose')
const ErrorHandler = require('../utils/errorHandeler')

const createNewAttempt = async (questionPaperId, sectionIds, userId, allQuestions) => {
    const sections = sectionIds.map((sectionId) => ({
        section: sectionId,
        questions: findQuestionsFromSection(allQuestions, sectionId),
    }))

    // console.log(sections[0].questions)

    let attempt = new AttemptModel({
        user: userId,
        sections,
        questionPaper: questionPaperId,
    })

    await attempt.save()
    return attempt.id
}

const getResult = async (attemptId) => {
    // debugger
    const result = await AttemptModel.findById(attemptId).populate({
        path: 'sections',
        populate: [
            'section',
            {
                path: 'questions',
                populate: [
                    'question',
                    {
                        path: 'question',
                        populate: ['area', 'topic', 'subject', 'section', 'questionType'],
                    },
                ],
            },
        ],
    })

    if (result)
        return result
    else
        throw new ErrorHandler('No result found', 404)
}

const findQuestionsFromSection = (questions, sectionId) => {
    return questions
        .filter((ques) => ques.section.toString() === sectionId)
        .map((ques) => {
            return { question: new mongoose.Types.ObjectId(ques._id) }
        })
}

module.exports = { createNewAttempt, getResult }
