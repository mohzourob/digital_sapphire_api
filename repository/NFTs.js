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

        await nftActivity.activities.unshift({
            event: "Create",
            price: nftDetails.price,
            currency: nftDetails.currency,
            from: nftDetails.owner,
            to: null
        })
        nftItem.status = "Unlist";


        if (nftDetails.price) {
            await nftActivity.activities.unshift({
                event: "List",
                price: nftDetails.price,
                currency: nftDetails.currency,
                from: nftDetails.owner,
                to: null
            })

            nftItem.status = "List";
        }

        await nftActivity.save();

        logger.info(`Created nft activity.`)

        nftItem.activity = nftActivity._id;
        await nftItem.save();
    } catch (err) {
        throw err;
    }
}



// activity unlisted in last price and listed in new price
export const updatePrice = async (userId, itemId, price) => {
    try {
        const nftItem = await NFT.findById(itemId)
            .populate("priceHistory")
            .populate("activity");

        if (!nftItem) {
            throw new HttpError(`NFT item not found.`, 404);
        }

        if (nftItem.owner.toString() !== userId.toString()) {
            throw new HttpError(`You are not owner of this nft item.`, 403);
        }

        if (nftItem.price === price) {
            throw new HttpError(`Price is same as last price.`, 400);
        }

        if (nftItem.status !== "List") {
            throw new HttpError(`NFT item is unlist.`, 400);
        }

        // edit item activity
        nftItem.activity.activities.unshift({
            event: "Unlist",
            price: nftItem.price,
            currency: nftItem.currency,
            from: null,
            to: null
        })

        nftItem.activity.activities.unshift({
            event: "List",
            price: price,
            currency: nftItem.currency,
            from: null,
            to: null
        })

        // edit item price history
        nftItem.priceHistory.priceHistory.unshift({
            price: price,
            currency: nftItem.currency,
        })


        // edit item price
        nftItem.price = price;

        await nftItem.save();
        await nftItem.activity.save();
        await nftItem.priceHistory.save();
    } catch (err) {
        throw err;
    }
}


export const listItem = async (userId, itemId, price) => {
    try {
        const nftItem = await NFT.findById(itemId)
            .populate("priceHistory")
            .populate("activity");

        if (!nftItem) {
            throw new HttpError(`NFT item not found.`, 404);
        }

        if (nftItem.owner.toString() !== userId.toString()) {
            throw new HttpError(`You are not owner of this nft item.`, 403);
        }

        if (nftItem.status !== "Unlist") {
            throw new HttpError(`NFT item is already listed.`, 400);
        }

        // edit item activity
        nftItem.activity.activities.unshift({
            event: "List",
            price,
            currency: nftItem.currency,
            from: null,
            to: null
        })


        // edit item price history
        nftItem.priceHistory.priceHistory.unshift({
            price: price,
            currency: nftItem.currency,
        })

        // edit item price
        nftItem.price = price;
        nftItem.status = "List";

        await nftItem.save();
        await nftItem.activity.save();
        await nftItem.priceHistory.save();
    } catch (err) {
        throw err;
    }
}


export const unListItem = async (userId, itemId) => {
    const nftItem = await NFT.findById(itemId)
        .populate("priceHistory")
        .populate("activity");

    if (!nftItem) {
        throw new HttpError(`NFT item not found.`, 404);
    }

    if (nftItem.owner.toString() !== userId.toString()) {
        throw new HttpError(`You are not owner of this nft item.`, 403);
    }

    if (nftItem.status !== "List") {
        throw new HttpError(`NFT item is unlist.`, 400);
    }

    // edit item activity
    nftItem.activity.activities.unshift({
        event: "Unlist",
        price: nftItem.price,
        currency: nftItem.currency,
        from: null,
        to: null
    })

    nftItem.status = "Unlist";

    await nftItem.save();
    await nftItem.activity.save();
}