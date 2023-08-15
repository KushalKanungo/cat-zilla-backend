const express = require('express')
const router = express.Router()
const sectionController = require('../controllers/sectionController')

// <======= Index Route =====>
router.post('/', sectionController.addSection)
router.post('/subject', sectionController.addSubjectId)
router.get('/', sectionController.getAllSections)
module.exports = router
