const express = require('express')
const router = express.Router()
const questionPaperController = require('../controllers/questionPaperController')
const attemptController = require('../controllers/attemptController')
const { cacheMiddleware } = require('../middlewares/cache')

// <======= Get All Question Papers List Paginated =====>
router.get('/', cacheMiddleware, questionPaperController.getQuestionPaper)

// <============= Add a new question paper =============>
router.post('/', questionPaperController.addQuestionPaper)

// <=============  Start new paper attempts ============>
router.post('/paper', questionPaperController.paper)

// <========== Add a new response ============>
router.post('/paper-response', attemptController.setResponse)
module.exports = router
