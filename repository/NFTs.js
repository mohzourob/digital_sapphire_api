import AccountResource from "../models/AccountResource.js";
import NFT from "../models/NFTItem.js";
import NFTPriceHistory from "../models/NFTPriceHistory.js";
import NFTActivity from "../models/NFTActivity.js"

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



export const createNFTItem = async (nftDetails) => {
    try {
        const nftItem = await NFT.create(nftDetails);
        logger.info("Save nft details to database.")

        let priceHistory;
        if (nftDetails.price) {
            logger.info(`NFT have price..`)
            priceHistory = await NFTPriceHistory.create({
                item: nftItem._id,
                priceHistory: [{
                    price: nftDetails.price,
                    currency: nftDetails.currency,
                    date: new Date()
                }]
            })
            logger.info(`Created and saved nft price history.`)
        } else {
            priceHistory = await NFTPriceHistory.create({
                item: nftItem._id
            })
            logger.info(`Created nft price hisory`)
        }

        nftItem.priceHistory = priceHistory._id;
        await nftItem.save();

        const nftActivity = await NFTActivity.create({
            item: nftItem._id
        })

        await nftActivity.activities.push({
            event: "Create",
            price: nftDetails.price,
            currency: nftDetails.currency,
            from: nftDetails.owner,
            to: null
        })

        if (nftDetails.price) {
            await nftActivity.activities.push({
                event: "List",
                price: nftDetails.price,
                currency: nftDetails.currency,
                from: nftDetails.owner,
                to: null
            })
        }

        await nftActivity.save();

        logger.info(`Created nft activity.`)

        nftItem.activity = nftActivity._id;
        await nftItem.save();
    } catch (err) {
        throw err;
    }
}


