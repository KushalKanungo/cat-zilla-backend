const QuestionPaper = require('../models/questionPaper')
const Section = require('../models/section')
const QuestionPaperSerializer = require('../views/questionPaperSerializer')
const AttemptService = require('./attemptService')

const questionPaperForTest = async ({
    id,
    sections,
    maxTime = 2400,
    user,
    forPreview = false,
}) => {
    const sectionIds = sections
    const questionPaper = await fetchQuestions(id, sectionIds)
    const selectedSections = await Section.find({ _id: { $in: sectionIds } })

    const serializedQuestionPaper =
        QuestionPaperSerializer.questionPaperForAttempt(
            questionPaper,
            selectedSections,
            maxTime,
            forPreview
        )
    if (forPreview) {
        return { ...serializedQuestionPaper }
    }

    const attemptId = await AttemptService.createNewAttempt(
        id,
        sectionIds,
        user._id,
        questionPaper.questions
    )

    return { ...serializedQuestionPaper, attemptId }
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
