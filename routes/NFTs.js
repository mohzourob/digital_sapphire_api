import { Router } from "express";
import { check } from "express-validator";
import {
    protect
} from "../middleware/authCheck.js";
import uploader, { ipfsFileUploader, ipfsMulter } from "../middleware/fileUploader.js";
import {
    uploadNFTFile,
    uploadMetaDataToIPFS
} from "../controllers/NFTs.js";


const router = Router();


router.post("/file", protect, ipfsMulter.single("nftfile"), ipfsFileUploader, uploadNFTFile);
router.post("/metadata", protect, [
    check("title").not().isEmpty(),
    check("description").not().isEmpty(),
    check("ipfsURL").isURL()
], uploadMetaDataToIPFS);

export default router;
