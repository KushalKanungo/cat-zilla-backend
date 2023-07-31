require('dotenv').config()
const sectionForAttempt = (
    section,
    serealized_questions,
    time = process.env.DEFAULT_SECTION_TIME
) => {
    return {
        id: section.id,
        questions: serealized_questions,
        label: section.label,
        maxTime: time,
        timeSpent: 0,
    }
}

module.exports = {
    sectionForAttempt,
}
