const express = require('express')
const router = express.Router()
const questionPaperController = require('../controllers/questionPaperController')

// <======= Index Route =====>
router.get('/', questionPaperController.getQuestionPaper)
router.post('/', questionPaperController.addQuestionPaper)
module.exports = router
