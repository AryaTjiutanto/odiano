import express from "express";
import requireAccessToken from "../middlewares/requireAccessToken.middleware";
import { generateCoverSignature, generatePostAssetSignature, generateProfileSignature } from "../controllers/upload.controller";
import { consume, longUploadFileLimiter, shortUploadFileLimiter } from "../libs/limiter";

const router = express.Router();

router.get("/profile-signature", consume(shortUploadFileLimiter), requireAccessToken, generateProfileSignature);
router.get("/cover-signature", consume(shortUploadFileLimiter), requireAccessToken, generateCoverSignature);
router.get("/post-asset", requireAccessToken, consume(longUploadFileLimiter), consume(shortUploadFileLimiter), generatePostAssetSignature)

export default router;