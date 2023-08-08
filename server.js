require('dotenv').config()

const express = require('express')
const connectDB = require('./src/configs/db')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const userRouter = require('./src/routes/usersRoutes')
const sectionsRouter = require('./src/routes/sectionsRoutes')
const questionPaperRouter = require('./src/routes/questionPaperRoute')
const questionRouter = require('./src/routes/questionRoute')
const attemptRouter = require('./src/routes/attemptRoutes')
const errorHandler = require('./src/middlewares/errorHandler')
const { setCurrentUser } = require('./src/middlewares/authInterceptor')

connectDB()

app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))

// Increase the limit to handle larger URL-encoded payloads
app.use(express.urlencoded({ limit: '10mb', extended: true }))

app.use(cors())
// <===== User Routes =====>
app.use('/api/users', userRouter)
app.use('/api/sections', sectionsRouter)
app.use('/api/attempts', attemptRouter)
app.use('/api/question', questionRouter)
app.use('/api/question-paper', setCurrentUser, questionPaperRouter)

app.use(errorHandler)
app.listen(3000)
