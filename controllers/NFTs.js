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
        logger.info(`Saving NFT file details for ${user.walletPublicAddress} address`);
        const fileDeatils = await nftsServices.saveNFTFileDetails(file, user);
        logger.info(`NFT file details saved for ${user.walletPublicAddress} address`);
        res.status(200).json({
            ...fileDeatils,
            ipfsHash: ipfsHash,
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


export const uploadMetaDataToIPFS = async (req, res, next) => {
    const { body: { title, description, ipfsURL } } = req;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpError(`${errors.errors[0].param}: ${errors.errors[0].msg}`, 400))
        }

        logger.info(`Uploading metadata to IPFS with details:  ${JSON.stringify({ title, description, ipfsURL })}`);
        const ipfsMetaDataHash = await nftsServices.uploadMetaDataToIPFS(title, description, ipfsURL);
        logger.info(`Metadata uploaded to IPFS for ${JSON.stringify({ title, description, ipfsURL })} with hash: ${ipfsMetaDataHash}`);
        res.status(200).json({
            ipfsMetaDataHash: ipfsMetaDataHash,
            ipfsURL: `https://ipfs.io/ipfs/${ipfsMetaDataHash}`
        })
    } catch (err) {
        logger.info(`Upload NFT metadata to IPFS failed.`);
        if (err.name === "HttpError") {
            next(err);
        }
        return next(new HttpError(err, 500))
    }
}

export const createNFTItem = async (req, res, next) => {
    const {
        body: {
            name,
            description,
            file,
            price,
            currency,
            exteraLinks,
            network,
            metaDataURL,
            metaDataProvider,
            metaDataStoreType
        },
        user: { _id: userId }
    } = req;


    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpError(`${errors.errors[0].param}: ${errors.errors[0].msg}`, 400))
        }

        logger.info(`Start create nft item with details: ${JSON.stringify({
            name,
            description,
            file,
            price,
            currency,
            exteraLinks,
            network,
            metaDataURL,
            metaDataProvider,
            metaDataStoreType
        })}`)


        const nftDetails = {};

        name && (nftDetails.name = name);
        description && (nftDetails.description = description);
        file && (nftDetails.file = file);
        price && (nftDetails.price = price);
        currency && (nftDetails.currency = currency);
        exteraLinks && (nftDetails.exteraLinks = exteraLinks);
        network && (nftDetails.network = network);
        metaDataURL && (nftDetails.metaDataURL = metaDataURL);
        metaDataProvider && (nftDetails.metaDataProvider = metaDataProvider);
        metaDataStoreType && (nftDetails.metaDataStoreType = metaDataStoreType);

        await nftsServices.createNFTItem(userId, nftDetails);
        logger.info(`Create nft item successfully.`)
        res.status(200).send({});
    } catch (err) {
        logger.info(`Create nft item failed.`)
        if (err.name === "HttpError") {
            next(err);
        }
        return next(new HttpError(err, 500))
    }
}


// list item no price zero 

// un list item will saved with last price in price history

// update price no 0 price
export const updatePrice = async (req, res, next) => {
    const {
        body: {
            itemId,
            price
        },
        user: { _id: userId }
    } = req;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new HttpError(`${errors.errors[0].param}: ${errors.errors[0].msg}`, 400))
        }
        logger.info(`Start update price with details: ${JSON.stringify({ itemId, price })}`)
        await nftsServices.updatePrice(userId, itemId, price);
        logger.info(`Update price successfully.`)
        res.status(200).send({});
    } catch (err) {
        logger.info(`Create nft item failed.`)
        if (err.name === "HttpError") {
            next(err);
        }
        return next(new HttpError(err, 500))
    }
}