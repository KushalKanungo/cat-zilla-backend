const express = require('express')
const router = express.Router()
const questionPaperController = require('../controllers/questionPaperController')

// <======= Index Route =====>
router.get('/', questionPaperController.getQuestionPaper)
router.post('/', questionPaperController.addQuestionPaper)
router.get('/paper', questionPaperController.paper)
module.exports = router
