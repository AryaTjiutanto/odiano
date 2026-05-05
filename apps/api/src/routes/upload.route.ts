import express from "express";
import requireAccessToken from "../middlewares/requireAccessToken.middleware";
import { generateProfileSignature } from "../controllers/upload.controller";

const router = express.Router();

router.get("/profile-signature", requireAccessToken, generateProfileSignature);

export default router;