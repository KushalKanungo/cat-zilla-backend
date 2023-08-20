const {
    questionWhileAttempt,
    questionWhilePreview,
} = require('./section/questionSerializer')
const { sectionForAttempt } = require('./section/sectionSerializer')

const questionPaperForAttempt = (
    questionPaper,
    sections,
    maxTime,
    forPreview = false
) => {
    const serializedQuestions = questionPaper.questions.map((question) =>
        forPreview
            ? questionWhilePreview(question)
            : questionWhileAttempt(question)
    )
    const serializedSections = sections.map((section) =>
        sectionForAttempt(
            section,
            serializedQuestions.filter((ques) => ques.sectionId == section.id),
            maxTime
        )
    )
    return {
        id: questionPaper.id,
        label: questionPaper.label,
        sections: serializedSections,
    }
}

const questionPaperListing = (questionPapers, per, page, total) => {
    const questions = questionPapers.map((questionPaper) => {
        return {
            id: questionPaper._id,
            label: questionPaper.label,
            questionsCount: questionPaper.questions.length,
            easy: questionPaper.easy,
            medium: questionPaper.medium,
            hard: questionPaper.hard,
            unknown: questionPaper.unknown,
            attempted: questionPaper.attempts?.length > 0,
            attemptId:
                questionPaper.attempts[questionPaper.attempts?.length - 1],
            description: questionPaper.description,
            createdAt: questionPaper.createdAt,
        }
    })
    return { questionPapers: questions, total, per, page }
}

module.exports = { questionPaperForAttempt, questionPaperListing }
