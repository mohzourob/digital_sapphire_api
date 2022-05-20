import { validationResult } from 'express-validator';
import * as userServices from "../services/Users.js";

import HttpError from "../models/HttpError.js";
import logger from "../utils/logger.js";


export const generateNonceCodeForAuthentication = async (req, res, next) => {
    try {
        let { body: { walletPublicAddress } } = req;
        walletPublicAddress = walletPublicAddress.toLowerCase();

        logger.info(`Creating nonce code for authentication ${walletPublicAddress} address`);
        const nonceCode = await userServices.generateNonceCodeForAuthentication(walletPublicAddress);
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


export const authenticationWithSignature = async (req, res, next) => {
    try {
        let { body: { signature, walletPublicAddress } } = req;
        walletPublicAddress = walletPublicAddress.toLowerCase();

        logger.info(`Checking authentication signature`);

        const isAuthenticated = await userServices.checkAuthenticationSignature(signature, walletPublicAddress);

        logger.info(`Authentication signature checked: ${isAuthenticated}`);
        res.status(200).json({
            isAuthenticated: isAuthenticated
        })
    } catch (err) {
        logger.error(`Check authentication signature failed.`)
        if (err.name === "HttpError") {
            next(err);
        }
        return next(new HttpError(err, 500))
    }
}