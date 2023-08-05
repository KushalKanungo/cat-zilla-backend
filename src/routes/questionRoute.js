const express = require('express')
const router = express.Router()
const questionController = require('../controllers/questionController')

// <======= Index Route =====>
router.get('/:id', questionController.getQuestionById)

module.exports = router
