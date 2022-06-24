import AccountResource from "../models/AccountResource.js"

import HttpError from "../models/HttpError.js";
import logger from "../utils/logger.js";


export const saveNFTFileDetails = async (fileDetails) => {
    try {
        const details = await AccountResource.create(fileDetails);
        return details;
    } catch (err) {
        throw err;
    }
}