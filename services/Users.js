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