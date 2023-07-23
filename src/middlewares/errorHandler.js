const errorHandler = (err, req, res, next) => {
    // Check if the error is a duplicate key error
    console.log('error handeler code', err.message)
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({ error: 'You are not authorized' })
    }
    if (
        err.name === 'MongoServerError' ||
        err.name === 'ValidationError' ||
        err.code === 11000
    ) {
        // Send an appropriate error response to the client
        // const fields = Object.keys(err.keyPattern)

        // let errorMessage = ''
        // fields.forEach((key) => { errorMessage += `${key} ${err.keyValue[key]} already exists. \n`  })
        // res.status(400).json({ error: errorMessage})
        res.status(400).json({ error: err.message })
    } else {
        // Handle other errors
        console.error(err)
        res.status(500).json({ error: `Internal Server Error ${err.name}` })
    }
}

module.exports = errorHandler
