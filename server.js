require('dotenv').config()

const express = require('express')
const connectDB = require('./src/configs/db')
const app = express()
const userRouter = require('./src/routes/usersRoutes')
const sectionsRouter = require('./src/routes/sectionsRoutes')
const questionPaperRouter = require('./src/routes/questionPaperRoute')
const errorHandler = require('./src/middlewares/errorHandler')

connectDB()

app.use(express.json({ limit: '10mb' }))

// Increase the limit to handle larger URL-encoded payloads
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// <===== User Routes =====>
app.use('/api/users', userRouter)
app.use('/api/sections', sectionsRouter)
app.use('/api/question-paper', questionPaperRouter)

app.use(errorHandler)
app.listen(3000)
