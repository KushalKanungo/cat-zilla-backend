const attempt = (attempt) => {
    let questions = []
    let sections = []
    attempt.sections.forEach((section) => {
        let tempSection = {
            sectionId: section.section._id,
            sectionName: section.section.label,
            timeSpent: section.timeSpent,
            correct: 0,
            total: 0,
            unanswered: 0,
            marks: 0,
            maximumMarks: 0,
        }
        section.questions.forEach((question) => {
            console.log(question.question.options, question.userResponse)
            const tempQuestion = {
                id: question.question._id,
                sectionId: question.question.section._id,
                questionNo: question.question.questionNo,
                sectionName: question.question.section.label,
                topicId: question.question.topic._id,
                topicName: question.question.topic.label,
                areaId: question.question.area._id,
                areaName: question.question.area.label,
                subjectId: question.question.subject._id,
                subjectName: question.question.subject.label,
                timeSpent: question.timeSpent,
                userResponse: question.userResponse ?? null,
                isCorrect:
                    question.userResponse === null
                        ? null
                        : question.question.options[
                              Number(question.userResponse)
                          ]?.isCorrect,
            }
            tempQuestion.marks = tempQuestion.isCorrect
                ? question.question.marks
                : tempQuestion.isCorrect === false
                ? -question.question.negativeMarks
                : 0
            questions.push(tempQuestion)
            tempSection.correct += tempQuestion.isCorrect ? 1 : 0
            tempSection.unanswered += tempQuestion.userResponse === null ? 1 : 0
            tempSection.total += 1
            tempSection.marks += tempQuestion.marks
            tempSection.maximumMarks += question.question.marks
        })
        tempSection.wrong =
            tempSection.total - tempSection.unanswered - tempSection.correct
        sections.push(tempSection)
    })
    return {
        id: attempt._id,
        questions: questions.sort((a, b) => a.questionNo - b.questionNo),
        sections,
        total: sections.reduce((sum, sec) => sum + sec.total, 0),
        correct: sections.reduce((sum, sec) => sum + sec.correct, 0),
        unanswered: sections.reduce((sum, sec) => sum + sec.unanswered, 0),
        wrong: sections.reduce((sum, sec) => sum + sec.wrong, 0),
        marks: sections.reduce((sum, sec) => sum + sec.marks, 0),
        maximumMarks: sections.reduce((sum, sec) => sum + sec.maximumMarks, 0),
    }
}

module.exports = { attempt }
