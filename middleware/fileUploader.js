import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import { v4 as uuidv4 } from "uuid";
import ipfs from "ipfs-api";

import {
    minFileTypes
} from "../utils/types.js";
import logger from "../utils/logger.js";

AWS.config.update({
    region: process.env.AWS_CONFIG_REGION,
    accessKeyId: process.env.AWS_CONFIG_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_CONFIG_SECRET_ACCESS_KEY
})

const s3Config = new AWS.S3({
    params: {
        Bucket: process.env.AWS_CONFIG_BUCKET_NAME
    }
});

const ipfsMulterStorage = multer.memoryStorage();


const fileFilter = (req, file, cb) => {
    if (minFileTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const multerS3Config = multerS3({
    s3: s3Config,
    bucket: process.env.AWS_CONFIG_BUCKET_NAME,
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        cb(null, `static/${req.user._id}-${req.user.walletPublicAddress}/${uuidv4()}-${file.originalname}`)
    }
});



const uploader = multer({
    storage: multerS3Config,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // we are allowing only 5 MB files
    }
})


export const ipfsMulter = multer({
    storage: ipfsMulterStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // we are allowing only 5 MB files
    }
});


export const ipfsFileUploader = async (req, res, next) => {
    try {
        const file = req.file;
        logger.info(`Starting upload file with details ${JSON.stringify({
            originalname: '1621343890996-p1f5vpk4o814i11bguc8jh6gc364-0 (2).png',
            encoding: '7bit',
            mimetype: 'image/png',
            size: 426930
        })}`);

        if (!file) {
            return next(new HttpError(`Invalid file type`, 400))
        }
        logger.info(`Uploading file to IPFS`);
        const ipfsClient = new ipfs({
            host: 'ipfs.infura.io',
            port: 5001,
            protocol: 'https',
            headers: {
                // authorization: 'Bearer ' + "6a5fd39831c349fcd4524899cd0efa16"
            },
            apiPath: "/api/v0"
        });

        const fileBuffer = await file.buffer;
        const ipfsHash = await ipfsClient.add(fileBuffer);
        const ipfsHashString = ipfsHash[0].hash;
        req.ipfsHash = ipfsHashString;
        logger.info(`File uploaded to IPFS with hash ${ipfsHashString}`);
        logger.info(`Uploading file to AWS S3 bucket ${process.env.AWS_CONFIG_BUCKET_NAME}, with key: static/${req.user._id}-${req.user.walletPublicAddress}/${uuidv4()}-${file.originalname}`);

        const objectParams = {
            Bucket: process.env.AWS_CONFIG_BUCKET_NAME,
            Key: `static/${req.user._id}-${req.user.walletPublicAddress}/${uuidv4()}-${file.originalname}`,
            Body: file.buffer
        }

        const { ETag: etag } = await new AWS.S3({ apiVersion: '2020-06-01' }).putObject(objectParams).promise()
        logger.info(`File uploaded to AWS S3 bucket ${process.env.AWS_CONFIG_BUCKET_NAME}, with key: static/${req.user._id}-${req.user.walletPublicAddress}/${uuidv4()}-${file.originalname} with etag: ${etag}`);

        req.file = {
            originalname: file.originalname,
            encoding: file.encoding,
            mimetype: file.mimetype,
            size: file.size,
            relativePath: `static/${req.user._id}-${req.user.walletPublicAddress}/${uuidv4()}-${file.originalname}`,
            etag: etag,
            awsPath: `https://${process.env.AWS_CONFIG_BUCKET_NAME}.s3.amazonaws.com/${objectParams.Key}`
        }

        next()
    } catch (err) {
        logger.error(`Upload NFT to ipfs file failed.`);
        logger.error(JSON.stringify(err));
        logger.error(err);
        return next(new HttpError('Upload NFT file failed', 401));
    }
}


export default uploader;
