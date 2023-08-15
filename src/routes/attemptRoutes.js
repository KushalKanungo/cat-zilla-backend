const express = require('express')
const router = express.Router()
const attemptController = require('../controllers/attemptController')
const cacheMiddleware = require('../middlewares/cache')

// <======= Index Route =====>
router.get('/:id', cacheMiddleware.cacheMiddleware, attemptController.getResult)
router.delete('/:id', cacheMiddleware.cacheMiddleware, attemptController.deleteResults)

// <====== Get All results ======>
router.get('/', attemptController.getAllResults)

module.exports = router
