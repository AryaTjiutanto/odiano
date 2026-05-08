import express from "express";
import requireAccessToken from "../middlewares/requireAccessToken.middleware";
import { generateProfileSignature } from "../controllers/upload.controller";
import { apiLimiter, consume } from "../libs/limiter";

const router = express.Router();

router.get("/profile-signature", consume(apiLimiter), requireAccessToken, generateProfileSignature);

export default router;