import { Router } from "express";
import { check } from "express-validator";
import {
    generateNonceCodeForAuthentication
} from "../controllers/Users.js";


const router = Router();

router.get("/nonceCode", generateNonceCodeForAuthentication)

export default router;