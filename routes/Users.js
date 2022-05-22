import { Router } from "express";
import { check } from "express-validator";
import {
    generateNonceCodeForAuthentication,
    authenticationWithSignature
} from "../controllers/Users.js";


const router = Router();

router.post("/nonceCode", [
    check("walletPublicAddress").isLength({ min: 42, max: 42 })
],
    generateNonceCodeForAuthentication)
router.post("/login", [
    check("signature").isLength({ min: 20 }),
    check("walletPublicAddress").isLength({ min: 42, max: 42 })
], authenticationWithSignature)

export default router;