const express = require('express')
const router = express.Router()
const questionPaperController = require('../controllers/questionPaperController')
const attemptController = require('../controllers/attemptController')
const { cacheMiddleware } = require('../middlewares/cache')

// <======= Index Route =====>
router.get('/', cacheMiddleware, questionPaperController.getQuestionPaper)
router.post('/', questionPaperController.addQuestionPaper)
router.post('/paper', questionPaperController.paper)
router.post('/paper-answer', attemptController.getFirstAttemptedQuestion)
module.exports = router
