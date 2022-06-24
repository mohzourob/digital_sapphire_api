import * as nftsRepository from '../repository/NFTs.js';

import HttpError from "../models/HttpError.js";
import logger from "../utils/logger.js";

export const saveNFTFileDetails = async (file, user) => {
    try {
        const fileDetails = {
            name: file.originalname,
            encoding: file.encoding,
            mimeType: file.mimetype,
            size: file.size,
            relativePath: "/" + file.relativePath,
            awsPath: file.awsPath,
            etag: file.etag,
            account: user._id,
        }

        const details = await nftsRepository.saveNFTFileDetails(fileDetails);
        return {
            _id: details._id,
            mimeType: details.mimeType,
            URL: details.awsPath,
        }
    } catch (err) {
        throw err;
    }
}