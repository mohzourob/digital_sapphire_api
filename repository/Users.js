import Account from "../models/Account.js";
import AccountResource from "../models/AccountResource.js"
import Profile from "../models/Profile.js"

import HttpError from "../models/HttpError.js";
import logger from "../utils/logger.js";


export const getUser = async (filter) => {
    try {
        const user = await Account.findOne(filter);
        return user;
    } catch (err) {
        throw err;
    }
}


export const createUser = async (user) => {
    try {
        const newUserDetails = await Account.create(user);
        const profile = await Profile.create({ account: newUserDetails._id });
        newUserDetails.profile = profile._id;
        await newUserDetails.save();
    } catch (err) {
        throw err;
    }
}



export const updateUser = (filter, newData) => {
    try {
        return Account.updateOne(filter, newData);
    } catch (err) {
        throw err;
    }
}


export const updateUserBanner = async (userId, file) => {
    try {
        const fileDetails = await AccountResource.create(file);
        logger.info(`Added successfully file to resource account collection`)
        await Profile.updateOne({ account: userId }, { bannerImage: fileDetails._id });
        logger.info(`Added successfully banner to profile details`);
    } catch (err) {
        throw err;
    }
}


export const updateUserCover = async (userId, file) => {
    try {
        const fileDetails = await AccountResource.create(file);
        logger.info(`Added successfully file to resource account collection`)
        await Profile.updateOne({ account: userId }, { coverImage: fileDetails._id });
        logger.info(`Added successfully cover image to profile details`);
    } catch (err) {
        throw err;
    }
}


export const updateUserProfileByAccountId = async (accountId, newData) => {
    try {
        await Profile.updateOne({ account: accountId }, newData);
    } catch (err) {
        if (err.message.includes("duplicate key error collection")) {
            if (err.message.includes("email")) {
                throw new HttpError(`Email already exists`, 400);
            }
            if (err.message.includes("username")) {
                throw new HttpError(`Username already exists`, 400);
            }
        }
        throw err;
    }
}