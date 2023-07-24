const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode ?? 500
    err.message = err.message ?? 'Internal Server Error'
    if (err.name === 'ValidationError') {
        res.status(400).json({ message: err.message })
    } else if (err.code === 11000) {
        console.log(err)
        res.status(400).json({
            message: 'Email already used.',
        })
    } else {
        res.status(err.statusCode).json({
            message: err.message,
        })
    }
}

module.exports = errorHandler
