import jwt from "jsonwebtoken";
import Account from "../models/Account.js";


import logger from "../utils/logger.js";
import HttpError from "../models/HttpError.js";


export const protect = async (req, res, next) => {
    if (!req.headers.authorization) {
        return next(new HttpError(`Not authorize to access this route`, 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(req.headers.authorization, process.env.JWT_ACCESS_TOKEN_SECRET);
        console.log(decoded);
        const userDetails = await Account.findById(decoded._id);

        if (!userDetails) {
            return next(new HttpError(`Not authorize to access this route`, 401));
        }

        if (!userDetails.isActive) {
            return next(new HttpError(`This account not active!`, 400));
        }

        if (userDetails.isDeleted) {
            return next(new HttpError(`This account is deleted!`, 400));
        }


        req.user = userDetails;
        next();
    } catch (err) {
        return next(new HttpError('Not authorize to access this route', 401));
    }
}