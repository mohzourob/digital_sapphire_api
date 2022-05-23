import { validationResult } from 'express-validator';
import * as userServices from "../services/Users.js";
import { ethers } from 'ethers';

import HttpError from "../models/HttpError.js";
import logger from "../utils/logger.js";


export const generateNonceCodeForAuthentication = async (req, res, next) => {
    let { body: { walletPublicAddress } } = req;
    walletPublicAddress = walletPublicAddress.toLowerCase();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpError(`${errors.errors[0].param}: ${errors.errors[0].msg}`, 400))
        }

        const isValidAddress = ethers.utils.isAddress(walletPublicAddress);
        if (!isValidAddress) {
            return next(new HttpError(`Invalid Address`, 400))
        }

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
    let { body: { signature, walletPublicAddress } } = req;
    walletPublicAddress = walletPublicAddress.toLowerCase();
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpError(`${errors.errors[0].param}: ${errors.errors[0].msg}`, 400))
        }

        const isValidAddress = ethers.utils.isAddress(walletPublicAddress);
        if (!isValidAddress) {
            return next(new HttpError(`Invalid Address`, 400))
        }

        logger.info(`Starting authentication process for ${walletPublicAddress} address`);
        const userToken = await userServices.checkAuthenticationSignature(signature, walletPublicAddress);

        logger.info(`Token sent successfully for ${walletPublicAddress} address`);
        res.status(200).json({
            token: userToken
        })
    } catch (err) {
        logger.error(`Authentication process failed for ${walletPublicAddress} address.`)
        if (err.name === "HttpError") {
            next(err);
        }
        return next(new HttpError(err, 500))
    }
}


export const updateBannerImage = async (req, res, next) => {
    const { file, user } = req;
    try {
        if (!file) {
            return next(new HttpError(`Invalid file type`, 400))
        }
        logger.info(`Upadting banner image for ${user.walletPublicAddress} address`);
        await userServices.updateUserBanner(user, file);
        res.status(200).send({})
        logger.info(`Banner image updated successfully for ${user.walletPublicAddress} address`);
    } catch (err) {
        logger.error(`Update banner image failed for ${user.walletPublicAddress} address.`)
        if (err.name === "HttpError") {
            next(err);
        }
        return next(new HttpError(err, 500))
    }
}

export const updateCoverImage = async (req, res, next) => {
    const { file, user } = req;
    try {
        if (!file) {
            return next(new HttpError(`Invalid file type`, 400))
        }

        logger.info(`Upadting cover image for ${user.walletPublicAddress} address`);
        await userServices.updateUserCover(user, file);
        res.status(200).send({})
        logger.info(`Cover image updated successfully for ${user.walletPublicAddress} address`);
    } catch (err) {
        if (err.name === "HttpError") {
            next(err);
        }
        return next(new HttpError(err, 500))
    }
}

export const updateProfile = async (req, res, next) => {
    try {

    } catch (err) {
        if (err.name === "HttpError") {
            next(err);
        }
        return next(new HttpError(err, 500))
    }
}