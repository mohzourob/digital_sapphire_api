import logger from "../utils/logger.js";
import HttpError from "../models/HttpError.js";
import {
    ApplicationsAccessKeys
} from "../utils/types.js"

export const protect = (req, res, next) => {

    if (isAuth) {
        logger.info(`New success access use >>>>>>>>>>> ${applicationName} App <<<<<<<<<< key.`)
        next()
    } else {
        return next(new HttpError(`Access Denied!`, 403))
    }
}