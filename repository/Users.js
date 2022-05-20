import User from "../models/Users.js";
import HttpError from "../models/HttpError.js";
import logger from "../utils/logger.js";


export const getUser = async (filter) => {
    try {
        const user = await User.findOne(filter);
        return user;
    } catch (err) {
        console.log(err)
    }
}


export const createUser = async (user) => {
    try {
        await User.create(user);
    } catch (err) {
        console.log(err)

    }
}


export const updateUser = (filter, newData) => {
    try {
        return User.updateOne(filter, newData, { upsert: true });
    } catch (err) {
        console.log(err)
    }
}