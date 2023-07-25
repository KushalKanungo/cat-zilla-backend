const express = require('express')
const router = express.Router()
const sectionController = require('../controllers/sectionController')

// <======= Index Route =====>
router.post('/', sectionController.addSection)
module.exports = router
