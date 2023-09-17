const { logger } = require('../../helpers/logger')

const attempt = (attempt) => {
    logger('Processing Result')
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
            let isCorrect
            if (
                question['userResponse'] === null ||
                question['userResponse'] === undefined
            ) {
                isCorrect = null
            } else if (
                question.question.questionType.label.toUpperCase() === 'MCQ'
            ) {
                isCorrect =
                    question.userResponse === null
                        ? null
                        : question.question.options[
                              Number(question.userResponse)
                          ]?.isCorrect
            } else {
                const matches = answerDetector(question.question.options)
                isCorrect =
                    question.userResponse === null
                        ? null
                        : Number(question.userResponse) === Number(matches?.[1])
            }
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
                questionType: question.question.questionType.label ?? 'false',
                subjectName: question.question.subject.label,
                timeSpent: question.timeSpent,
                userResponse: question.userResponse ?? null,
                isCorrect: isCorrect,
            }
            tempQuestion.marks = tempQuestion.isCorrect
                ? question.question.marks
                : tempQuestion.isCorrect === false
                ? -question.question.negativeMarks
                : 0
            questions.push(tempQuestion)
            tempSection.correct += tempQuestion.isCorrect ? 1 : 0
            tempSection.unanswered += tempQuestion.isCorrect === null ? 1 : 0
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

const attempListing = (attempts, per, page, total) => {
    const attemptsData = attempts.map((attempt) => {
        return {
            id: attempt._id,
            label: attempt.label,
            questionPaperName: attempt.questionPaper.label,
            questionPaperId: attempt.questionPaper.id,
            createdAt: attempt.createdAt,
        }
    })
    return { attempts: attemptsData, total, per, page }
}

const answerDetector = (options) => {
    let matches = options
        .find((option) => option.isCorrect)
        .option.match(/>(\d+)</)
    if (matches === null || matches === undefined || matches?.length < 1) {
        matches = options
            .find((option) => option.isCorrect)
            .option.match(/(\d+)/)
    }
    return matches
}

const timeline = (results, count) => {
    const serialized = results.map((result) => ({
        questionPaper: result.questionPaper.label,
        total: result.total,
        correct: result.correct,
        wrong: result.wrong,
        unswered: result.unswered,
        marks: result.marks,
        maximumMarks: result.maximumMarks,
        createdAt: result.attempt?.createdAt,
    }))
    return { results: serialized, total: count }
}

module.exports = { attempt, attempListing, timeline }
