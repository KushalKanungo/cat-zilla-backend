const express = require('express')
const router = express.Router()
const userController = require('../controllers/usersController')
const { setCurrentUser } = require('../middlewares/authInterceptor')

// <======= Index Route =====>
router.get('/', userController.index)
router.post('/', userController.signUp)
router.get('/login', userController.signIn)
router.get('/test', setCurrentUser, userController.test)

module.exports = router
