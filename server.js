require('dotenv').config()

const express = require('express')
const connectDB = require('./src/configs/db')
const app = express()
const userRouter = require('./src/routes/usersRoutes')
const errorHandler = require('./src/middlewares/errorHandler')

connectDB()
app.use(express.json())

// <===== User Routes =====>
app.use('/api/users', userRouter)

app.use(errorHandler)
app.listen(3000)
