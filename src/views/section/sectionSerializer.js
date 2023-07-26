const sectionForAttempt = (section, serealized_questions, time = 3600) => {
    return {
        id: section.id,
        questions: serealized_questions,
        label: section.label,
        maxTime: time,
    }
}

module.exports = {
    sectionForAttempt,
}
