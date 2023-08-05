const attempt = (attempt) => {
    let questions = []
    attempt.sections.forEach((section) => {
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
                isCorrent:
                    question.question.options[Number(question.userResponse)]
                        ?.isCorrect ?? null,
            }
            questions.push(tempQuestion)
        })
    })
    return questions
}

module.exports = { attempt }
