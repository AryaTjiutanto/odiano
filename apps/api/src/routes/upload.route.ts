import express from "express";
import requireAccessToken from "../middlewares/requireAccessToken.middleware";
import { generateCoverSignature, generateProfileSignature } from "../controllers/upload.controller";
import { apiLimiter, consume } from "../libs/limiter";

const router = express.Router();

router.get("/profile-signature", consume(apiLimiter), requireAccessToken, generateProfileSignature);
router.get("/cover-signature", consume(apiLimiter), requireAccessToken, generateCoverSignature);

export default router;