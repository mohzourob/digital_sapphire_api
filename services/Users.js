import { v4 as uuidv4 } from 'uuid';

import HttpError from "../models/HttpError.js";
import logger from "../utils/logger.js";
import * as userRepository from "../repository/Users.js";


export const generateNonceCodeForAuthentication = () => {
    return uuidv4().replace(/-/g, '');
}