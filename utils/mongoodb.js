import mongoose from "mongoose";
import logger from "./logger.js";



export const connectMongodb = async () => {
    const databaseUrl = process.env.MONGODB_URL;
    try {
        await mongoose.connect(databaseUrl, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        logger.info(`Connected To Database Successfull. URL: ${databaseUrl}`)
    } catch (err) {
        logger.error(`Faild to connect to database. URL: ${databaseUrl}`)
    }
}