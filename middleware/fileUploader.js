import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import {
    minFileTypes
} from "../utils/types.js";
import { v4 as uuidv4 } from "uuid";

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


export default uploader;
