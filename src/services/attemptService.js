const AttemptModel = require('../models/attempt')
const mongoose = require('mongoose')

const createNewAttempt = async (questionPaperId, sectionIds, allQuestions) => {
    const sections = sectionIds.map((sectionId) => ({
        section: sectionId,
        questions: findQuestionsFromSection(allQuestions, sectionId),
    }))

    // console.log(sections[0].questions)

    let attempt = new AttemptModel({
        user: '64bcec0f271eaaef7297dc57',
        sections,
        quesionPaper: questionPaperId,
    })

    await attempt.save()
}

const findQuestionsFromSection = (questions, sectionId) => {
    return questions
        .filter((ques) => ques.section.toString() === sectionId)
        .map((ques) => {
            return { question: new mongoose.Types.ObjectId(ques._id) }
        })
}

module.exports = { createNewAttempt }
