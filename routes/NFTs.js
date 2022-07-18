import { Router } from "express";
import { check } from "express-validator";
import {
    protect
} from "../middleware/authCheck.js";
import { ipfsFileUploader, ipfsMulter } from "../middleware/fileUploader.js";
import {
    uploadNFTFile,
    uploadMetaDataToIPFS,
    createNFTItem,
    updatePrice,
    listItem,
    unListItem
} from "../controllers/NFTs.js";


const router = Router();


router.post("/file", protect, ipfsMulter.single("nftfile"), ipfsFileUploader, uploadNFTFile);
router.post("/metadata", protect, [
    check("title").isString().not().isEmpty(),
    check("description").isString().not().isEmpty(),
    check("ipfsURL").isURL()
], uploadMetaDataToIPFS);
router.post("/create", protect, [
    check("name").isString().not().isEmpty(),
    check("description").isString().not().isEmpty(),
    check("file").isMongoId(),
    check("price").isNumeric().optional(),
    check("currency").isString().notEmpty().isIn(["ETH"]).optional(),
    check("exteraLinks").isArray().optional(),
    check("exteraLinks.*").isURL(),
    check("network").isString().notEmpty().isIn(["Ethereum", "Polygon"]),
    check("metaDataURL").isURL(),
    check("metaDataProvider").isString().notEmpty().isIn(["IPFS", "Torrent", "S3"]).optional(),
    check("metaDataStoreType").isString().notEmpty().isIn(["DECENTRALIZED", "CENTRALIZED"]).optional()
], createNFTItem);
router.put("/price", protect, [
    check("price").isNumeric(),
    check("itemId").isMongoId()
], updatePrice)
router.put("/list", protect, [
    check("price").isNumeric(),
    check("itemId").isMongoId()
], listItem)
router.put("/unlist", protect, [
    check("itemId").isMongoId()
], unListItem)

export default router;
