import cors from "cors";
import {
    allowedOrigin
} from "../utils/types.js";
import HttpError from "../models/HttpError.js";


const checkllowedOrigin = () => {
    // allowed apps.
    const corsOptions = {
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true)
            }

            if (typeof (allowedOrigin[process.env.NODE_ENV]) === "string" && allowedOrigin[process.env.NODE_ENV] === "*") {
                return callback(null, true)
            }

            if (typeof (allowedOrigin[process.env.NODE_ENV]) === "object" && allowedOrigin[process.env.NODE_ENV].indexOf(origin) !== -1) {
                return callback(null, true)
            }

            return callback(new HttpError("Not Allowed Origin :P", 403))
        }
    }


    return cors(corsOptions);
}


export default checkllowedOrigin;