import { v4 as uuidv4 } from 'uuid';
import { ethers } from "ethers";

import HttpError from "../models/HttpError.js";
import logger from "../utils/logger.js";
import * as userRepository from "../repository/Users.js";


export const generateNonceCodeForAuthentication = async (walletPublicAddress) => {
    try {
        const code = uuidv4().replace(/-/g, '');

        // update user nonce code and create if not found
        await userRepository.updateUser({ walletPublicAddress }, { nonceCode: code });

        return code;
    } catch (err) {
        console.log(err)
    }
}


export const checkAuthenticationSignature = async (signature, walletPublicAddress) => {
    try {
        const user = await userRepository.getUser({ walletPublicAddress });
        if (!user) {
            throw new HttpError(`User with ${walletPublicAddress} address not found`, 404);
        }

        const signerAddress = ethers.utils.verifyMessage(user.nonceCode, signature);
        if (signerAddress !== walletPublicAddress) {
            throw new HttpError(`Signature is not valid`, 401);
        }


    } catch (err) {
        console.log(err)
    }
}