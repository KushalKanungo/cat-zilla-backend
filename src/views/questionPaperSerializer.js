const { questionWhileAttempt } = require('./section/questionSerializer')
const { sectionForAttempt } = require('./section/sectionSerializer')

const questionPaperForAttempt = (questionPaper, sections) => {
    const serializedQuestions = questionPaper.questions.map((question) =>
        questionWhileAttempt(question)
    )
    const serializedSections = sections.map((section) =>
        sectionForAttempt(
            section,
            serializedQuestions.filter((ques) => ques.sectionId == section.id)
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
            description: questionPaper.description,
            createdAt: questionPaper.createdAt,
        }
    })
    return { questionPapers: questions, total, per, page }
}

module.exports = { questionPaperForAttempt, questionPaperListing }
