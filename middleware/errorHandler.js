import logger from "../utils/logger.js"


const errorHandler = (error, req, res, next) => {
    // save error logs
    if (error.name === "Error") {
        logger.error(JSON.stringify({ message: error.message, code: error.code, stack: error.stack }))
    } else {
        logger.error(JSON.stringify({ message: error.message, code: error.code, stack: error.stack }))
        logger.error(JSON.stringify(error))
    }

    if (error.name === "HttpError") {
        // send error response
        if (error.statusCode === 500) error.message = "Server Error!"
        return res.status(error.statusCode || 500).send({
            Error: error.message || "Server Error!"
        })
    } else {
        // send error response
        return res.status(500).send({
            Erorr: "Server Error!"
        })
    }
}


export default errorHandler;