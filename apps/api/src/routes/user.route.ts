import express from "express";
import requireAccessToken from "../middlewares/requireAccessToken.middleware";
import { createUserProfileSchema, updateUserProfile } from "@odiano/shared";
import { validateData } from "../middlewares/validateData.middleware";
import { checkUsernameAvailability, getUserProfile, onboarding, updateProfile } from "../controllers/user.controller";
import { apiLimiter, consume, searchLimiter } from "../libs/limiter";
import optionalAuth from "../middlewares/optionalAuth.middleware";

const router = express.Router();

router.post("/onboarding", consume(apiLimiter), requireAccessToken, validateData(createUserProfileSchema), onboarding);
router.get("/check-username", consume(searchLimiter), checkUsernameAvailability);
router.put("/profile/update", requireAccessToken, consume(apiLimiter, (req => req.userId!)), validateData(updateUserProfile), updateProfile);
router.get("/:username", consume(apiLimiter), optionalAuth, getUserProfile);

export default router;