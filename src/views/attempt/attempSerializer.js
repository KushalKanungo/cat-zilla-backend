const attempt = (attempt) => {
    let questions = []
    let sections = []
    attempt.sections.forEach((section) => {
        let tempSection = {
            id: section.section._id,
            timeSpent: section.timeSpent,
            correct: 0,
            total: 0,
            unanswered: 0,
        }
        section.questions.forEach((question) => {
            console.log(question.question.options, question.userResponse)
            const tempQuestion = {
                id: question.question._id,
                sectionId: question.question.section._id,
                // sectionName: question.question.section.label,
                topicId: question.question.topic._id,
                // topicName: question.question.topic.label,
                areaId: question.question.area._id,
                // areaName: question.question.area.label,
                subjectId: question.question.subject._id,
                // subjectName: question.question.subject.label,
                timespent: question.timeSpent,
                isCorrect:
                    question.question.options[Number(question.userResponse)]
                        ?.isCorrect ?? null,
            }
            questions.push(tempQuestion)
            tempSection.correct += tempQuestion.isCorrect ? 1 : 0
            tempSection.unanswered += tempQuestion.isCorrect === null ? 1 : 0
            tempSection.total += 1
        })
        sections.push(tempSection)
    })
    return {
        id: attempt._id,
        questions,
        sections,
    }
}

module.exports = { attempt }
