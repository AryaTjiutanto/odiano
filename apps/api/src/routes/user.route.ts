import express from "express";
import requireAccessToken from "../middlewares/requireAccessToken.middleware";
import { createUserProfileSchema } from "@connect/shared";
import { validateData } from "../middlewares/validateData.middleware";
import { checkUsernameAvailability, getUserProfile, onboarding } from "../controllers/user.controller";
import { apiLimiter, consume, searchLimiter } from "../libs/limiter";

const router = express.Router();

router.post("/onboarding", consume(apiLimiter), requireAccessToken, validateData(createUserProfileSchema), onboarding);
router.get("/check-username", consume(searchLimiter), checkUsernameAvailability);
router.get("/:username", consume(apiLimiter), requireAccessToken, getUserProfile);

export default router;