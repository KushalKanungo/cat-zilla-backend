const mongoose = require('mongoose')

const SectionSchema = new mongoose.Schema(
    {
        label: { type: String, required: true, unique: true },
        description: String,
        identifying_subject_ids: [Number],
    },
    { timestamps: true }
)

module.exports = mongoose.model('Sections', SectionSchema)
