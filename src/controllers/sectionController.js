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

const getAllSections = async(req, res, next) => {
    try {
        const sections = await Section.find({})
        res.status(200).json(sections.map(({label, id}) => ({label, id})))
    } catch (error) {
        return next(error)
    }

}

const addSubjectId = async(req, res, next) => {
    try {
        const { sectionId, subjectId } = req.body
        await Section.findOneAndUpdate({_id: sectionId}, { $addToSet: { subject_ids: subjectId } })
        return res.status(201).json({message: 'Subject Id added successfully added.'})
    } catch (error) {
        next(error)        
    }
} 

module.exports = {
    addSection,
    getAllSections,
    addSubjectId
}
