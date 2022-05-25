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
    const { user: { _id: accountId, walletPublicAddress }, body: {
        firstName,
        lastName,
        username,
        email,
        bio,
        facebook,
        instagram,
        twiiter,
        discord,
        website
    } } = req;


    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpError(`${errors.errors[0].param}: ${errors.errors[0].msg}`, 400))
        }

        const updateData = { links: {} };

        firstName && (updateData.firstName = firstName);
        lastName && (updateData.lastName = lastName);
        username && (updateData.username = username);
        email && (updateData.email = email);
        bio && (updateData.bio = bio);
        facebook && (updateData.links.facebook = facebook);
        instagram && (updateData.links.instagram = instagram);
        twiiter && (updateData.links.twiiter = twiiter);
        discord && (updateData.links.discord = discord);
        website && (updateData.links.website = website);

        console.log(updateData);

        logger.info(`Upadting profile for ${walletPublicAddress} address with data: ${JSON.stringify(updateData)}`);
        if (Object.keys(updateData).length > 0) {
            console.log("here")
            await userServices.updateUserProfile(accountId, updateData);
        }

        res.status(200).send({})
        logger.info(`Profile updated successfully for ${walletPublicAddress} address`);
    } catch (err) {
        if (err.name === "HttpError") {
            next(err);
        }
        return next(new HttpError(err, 500))
    }
}