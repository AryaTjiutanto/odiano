import express from "express";
import requireAccessToken from "../middlewares/requireAccessToken.middleware.js";
import { generateCoverSignature, generatePostMediaSignature, generateProfileSignature } from "../controllers/upload.controller.js";
import { consume, longUploadFileLimiter, shortUploadFileLimiter } from "../libs/limiter/index.js";

const router = express.Router();

router.get("/profile-signature", consume(shortUploadFileLimiter), requireAccessToken, generateProfileSignature);
router.get("/cover-signature", consume(shortUploadFileLimiter), requireAccessToken, generateCoverSignature);
router.get("/post-media", requireAccessToken, consume(longUploadFileLimiter), consume(shortUploadFileLimiter), generatePostMediaSignature)

export default router;