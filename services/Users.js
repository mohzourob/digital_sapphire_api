import { v4 as uuidv4 } from 'uuid';
import { ethers } from "ethers";
import jwt from "jsonwebtoken";

import HttpError from "../models/HttpError.js";
import logger from "../utils/logger.js";
import * as userRepository from "../repository/Users.js";


export const generateNonceCodeForAuthentication = async (walletPublicAddress) => {
    try {
        const code = uuidv4().replace(/-/g, '');

        // update user nonce code and create if not found
        logger.info(`Creating new nonce code for authentication ${walletPublicAddress} address, and add address as new user if not found`);
        const user = await userRepository.getUser({ walletPublicAddress });
        if (!user) {
            await userRepository.createUser({ walletPublicAddress, nonceCode: code });
        } else {
            await userRepository.updateUser({ walletPublicAddress }, { nonceCode: code });
        }

        return code;
    } catch (err) {
        throw err;
    }
}


export const checkAuthenticationSignature = async (signature, walletPublicAddress) => {
    try {
        logger.info(`Get user details for ${walletPublicAddress} address`);
        const user = await userRepository.getUser({ walletPublicAddress });

        if (!user) {
            logger.error(`User not found for ${walletPublicAddress} address`);
            throw new HttpError(`User with ${walletPublicAddress} address not found`, 404);
        }

        logger.info(`Checking signature: ${signature} if signed with ${walletPublicAddress} address`);
        const signerAddress = ethers.utils.verifyMessage(user.nonceCode, signature);

        logger.info(`Signer address after verify process is: ${signerAddress}`);
        if (signerAddress.toLowerCase() !== walletPublicAddress) {
            logger.error(`Signature is not valid for ${walletPublicAddress} address`);
            throw new HttpError(`Unauthorized`, 401);
        }
        logger.info(`Signature is valid for ${walletPublicAddress} address`);

        logger.info(`Creating token for ${walletPublicAddress} address`);
        const userToken = jwt.sign({
            _id: user._id,
            walletPublicAddress: user.walletPublicAddress
        }, process.env.JWT_ACCESS_TOKEN_SECRET, {
            algorithm: "HS256",
        })

        logger.info(`Token created successfully for ${walletPublicAddress} address`);
        return userToken;
    } catch (err) {
        throw err;
    }
}


export const updateUserBanner = async (user, file) => {
    try {
        if (!file.mimetype.includes("image")) {
            throw new HttpError(`Invalid file type`, 400);
        }
        const fileDetails = {
            name: file.originalname,
            encoding: file.encoding,
            mimeType: file.mimetype,
            size: file.size,
            relativePath: "/" + file.key,
            awsPath: file.location,
            etag: file.etag,
            account: user._id,
        }
        logger.info(`Updating user banner file details for ${user.walletPublicAddress} address is: ${JSON.stringify(fileDetails)}`);
        await userRepository.updateUserBanner(user._id, fileDetails);
    } catch (err) {
        throw err;
    }
}


export const updateUserCover = async (user, file) => {
    try {
        if (!file.mimetype.includes("image")) {
            throw new HttpError(`Invalid file type`, 400);
        }
        const fileDetails = {
            name: file.originalname,
            encoding: file.encoding,
            mimeType: file.mimetype,
            size: file.size,
            relativePath: "/" + file.key,
            awsPath: file.location,
            etag: file.etag,
            account: user._id,
        }
        logger.info(`Updating user cover image file details for ${user.walletPublicAddress} address is: ${JSON.stringify(fileDetails)}`);
        await userRepository.updateUserCover(user._id, fileDetails);
    } catch (err) {
        throw err;
    }
}