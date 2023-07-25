const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const SectionSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        label: { type: String, required: true },
        description: String,
        subject_ids: [mongoose.Schema.Types.Number],
    },
    { timestamps: true }
)

module.exports = mongoose.model('Sections', SectionSchema)
