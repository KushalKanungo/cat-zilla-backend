const Section = require('../models/section')

const addSection = async (req, res, next) => {
    try {
        const { name, label, description, subject_ids } = req.body
        const newSection = new Section({
            name,
            label,
            description,
            subject_ids,
        })
        await newSection.save()
        res.status(201).json({
            message: `${newSection.name} added successfully.`,
        })
    } catch (err) {
        return next(err)
    }
}

module.exports = {
    addSection,
}
