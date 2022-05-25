import { Router } from "express";
import { check } from "express-validator";
import {
    generateNonceCodeForAuthentication,
    authenticationWithSignature,
    updateBannerImage,
    updateCoverImage,
    updateProfile,
} from "../controllers/Users.js";
import {
    protect
} from "../middleware/authCheck.js";
import uploader from "../middleware/fileUploader.js"


const router = Router();

router.post("/nonceCode", [
    check("walletPublicAddress").isLength({ min: 42, max: 42 })
],
    generateNonceCodeForAuthentication)
router.post("/login", [
    check("signature").isLength({ min: 20 }),
    check("walletPublicAddress").isLength({ min: 42, max: 42 })
], authenticationWithSignature)

router.put("/profile/banner", protect, uploader.single('banner'), updateBannerImage)
router.put("/profile/cover", protect, uploader.single('cover'), updateCoverImage)
router.put("/profile/details", [
    check("firstName").isLength({ min: 1 }).optional(),
    check("lastName").isLength({ min: 1 }).optional(),
    check("bio").isLength({ min: 1 }).optional(),
    check("username").isLength({ min: 4 }).optional().withMessage("Username must be at least 4 characters long"),
    check("email").isEmail().optional(),
    check("facebook").isURL().optional(),
    check("instagram").isURL().optional(),
    check("twitter").isURL().optional(),
    check("discord").isURL().optional(),
    check("website").isURL().optional()
], protect, updateProfile)

export default router;