import * as nftsRepository from '../repository/NFTs.js';
import ipfsClient from '../utils/ipfs.js';

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


export const uploadMetaDataToIPFS = async (title, description, ipfsURL) => {
    try {
        const metadata = {
            title,
            description,
            ipfsURL,
        }

        const ipfsHash = await ipfsClient.add(Buffer.from(JSON.stringify(metadata)));
        return ipfsHash.path;

    } catch (err) {
        throw err;
    }
}