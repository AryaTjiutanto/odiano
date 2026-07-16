import express from "express";
import requireAccessToken from "../middlewares/requireAccessToken.middleware";
import { generateCoverSignature, generateProfileSignature } from "../controllers/upload.controller";
import { consume, uploadFileLimiter } from "../libs/limiter";

const router = express.Router();

router.get("/profile-signature", consume(uploadFileLimiter), requireAccessToken, generateProfileSignature);
router.get("/cover-signature", consume(uploadFileLimiter), requireAccessToken, generateCoverSignature);

export default router;