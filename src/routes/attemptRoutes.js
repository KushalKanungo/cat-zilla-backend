const express = require('express')
const router = express.Router()
const attemptController = require('../controllers/attemptController')
const cacheMiddleware = require('../middlewares/cache')

// <======= Index Route =====>
router.get('/:id', cacheMiddleware.cacheMiddleware, attemptController.getResult)

module.exports = router
