const express = require("express")
const router = express.Router()
const userController = require('../controllers/usersController')

// <======= Index Route =====>
router.get("/", userController.index)
router.post("/", userController.signUp)

module.exports = router
