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

module.exports = { questionPaperForAttempt }
