const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode ?? 500
    err.message = err.message ?? 'Internal Server Error'
    if (err.name === 'ValidationError') {
        res.status(400).json({ message: err.message })
    } else if (err.code === 11000) {
        const fieldNames = Object.keys(err.keyPattern)
        const errorMessages = fieldNames.map((field) => {
            return `${err.keyValue[field]} ${field} already exists.`
        })
        res.status(400).json({
            message: errorMessages.join('\n'),
        })
    } else {
        console.error(err)
        res.status(err.statusCode).json({
            message: err.message,
        })
    }
}

module.exports = errorHandler
