/**
 * This function serialize the question Model for test
 * @param {Question Model} question : Question Model
 * @returns Serielized Question Object with {id, passage, question, option, quesType}
 */
const questionWhileAttempt = (question) => {
    return {
        id: question.id,
        passage: question.passage,
        question: question.question,
        sectionId: question.section,
        quesType: question.questionType.label,
        timeSpent: 0,
        options: question.options.map((option) => ({
            id: option.index,
            value: option.option,
        })),
    }
}

const questionWhilePreview = (question) => {
    return {
        id: question.id,
        passage: question.passage,
        question: question.question,
        explanation: question.explanation,
        sectionId: question.section,
        quesType: question.questionType.label,
        timeSpent: 0,
        options: question.options.map((option) => ({
            id: option.index,
            value: option.option,
            isCorrect: option.isCorrect,
        })),
    }
}

module.exports = {
    questionWhileAttempt,
    questionWhilePreview,
}
