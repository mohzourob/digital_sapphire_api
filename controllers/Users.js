import { validationResult } from 'express-validator';
import * as userServices from "../services/Users.js";

import HttpError from "../models/HttpError.js";
import logger from "../utils/logger.js";


export const generateNonceCodeForAuthentication = async (req, res, next) => {
    try {
        logger.info(`Creating nonce code for authentication`);
        const nonceCode = userServices.generateNonceCodeForAuthentication();
        logger.info(`Nonce code for authentication created: ${nonceCode}`);
        res.status(200).json({
            nonceCode: nonceCode
        });
    } catch (err) {
        logger.error(`Create nonce code failed.`)
        if (err.name === "HttpError") {
            next(err);
        }
        return next(new HttpError(err, 500))
    }
}
