const AttemptModel = require('../models/attempt')
const StatusEnum = require('../_enums/status')

const getFirstAttemptedQuestion = async (req, res, next) => {
    const {
        attemptId,
        sectionId,
        questionId,
        status,
        timeSpent,
        userResponse,
    } = req.body
    // await AttemptModel.findOneAndUpdate(
    //     {
    //         _id: attemptId,
    //     },
    //     {
    //         $set: {
    //             'sections.$[section].questions.$[question].userResponse':
    //                 response,
    //             'sections.$[section].questions.$[question].status': status,
    //             'sections.$[section].questions.$[question].timeTaken':
    //                 timeTaken,
    //         },
    //     },
    //     {
    //         new: true,
    //         arrayFilters: [
    //             { 'question.question': questionId },
    //             { 'section.section': sectionId },
    //         ],
    //     }
    // )

    await AttemptModel.findOneAndUpdate(
        { _id: attemptId },
        {
            $set: {
                'sections.$[section].questions.$[question].userResponse':
                    userResponse,
                'sections.$[section].questions.$[question].status': status,
                'sections.$[section].questions.$[question].timeSpent':
                    timeSpent,
            },
        },
        {
            arrayFilters: [
                { 'section.questions.question': questionId },
                { 'question.question': questionId },
            ],
        }
    )
    res.status(200).json({ message: 'Answer updated successfully' })
}

module.exports = { getFirstAttemptedQuestion }
