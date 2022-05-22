import Account from "../models/Account.js";
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
        await Account.create(user);
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