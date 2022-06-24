import { validationResult } from 'express-validator';
import * as nftsServices from "../services/NFTs.js";

import HttpError from "../models/HttpError.js";
import logger from "../utils/logger.js";

export const uploadNFTFile = async (req, res, next) => {
    const { file, user, ipfsHash } = req;
    try {
        if (!file) {
            return next(new HttpError(`Invalid file type`, 400))
        }

        const fileDeatils = await nftsServices.saveNFTFileDetails(file, user);

        res.status(200).json({
            ...fileDeatils,
            ipfsURL: `https://ipfs.io/ipfs/${ipfsHash}`
        })

        res.status(200).json();
    } catch (err) {
        logger.info(`Upload NFT file failed.`);
        if (err.name === "HttpError") {
            next(err);
        }
        return next(new HttpError(err, 500))
    }
}