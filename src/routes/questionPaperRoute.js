const express = require('express')
const router = express.Router()
const questionPaperController = require('../controllers/questionPaperController')
const attemptController = require('../controllers/attemptController')

// <======= Index Route =====>
router.get('/', questionPaperController.getQuestionPaper)
router.post('/', questionPaperController.addQuestionPaper)
router.post('/paper', questionPaperController.paper)
router.post('/paper-answer', attemptController.getFirstAttemptedQuestion)
module.exports = router
