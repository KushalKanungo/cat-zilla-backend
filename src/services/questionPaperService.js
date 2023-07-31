const QuestionPaper = require('../models/questionPaper')
const Section = require('../models/section')
const QuestionPaperSerializer = require('../views/questionPaperSerializer')
const AttemptService = require('./attemptService')

const questionPaperForTest = async ({ id, sections }) => {
    const sectionIds = sections.map((section) => section.id)
    const questionPaper = await fetchQuestions(id, sectionIds)
    const selectedSections = await Section.find({ _id: { $in: sectionIds } })
    const serializedQuestionPaper =
        QuestionPaperSerializer.questionPaperForAttempt(
            questionPaper,
            selectedSections
        )
    // await AttemptService.createNewAttempt(
    //     id,
    //     sectionIds,
    //     questionPaper.questions
    // )
    return serializedQuestionPaper
}

const fetchQuestions = async (questionPaperID, sectionIds) => {
    const questions = await QuestionPaper.findById(questionPaperID).populate({
        path: 'questions',
        match: { section: { $in: sectionIds } },
        populate: { path: 'questionType' },
    })
    return questions
}

module.exports = {
    questionPaperForTest,
}
