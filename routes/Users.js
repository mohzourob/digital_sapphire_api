import { Router } from "express";
import { check } from "express-validator";
import {
    generateNonceCodeForAuthentication,
    authenticationWithSignature
} from "../controllers/Users.js";


const router = Router();

router.post("/nonceCode", generateNonceCodeForAuthentication)
router.post("/login", authenticationWithSignature)

export default router;