import express from "express";
import requireAccessToken from "../middlewares/requireAccessToken.middleware.js";
import { createUserProfileSchema, updateUserProfile } from "@odiano/shared";
import { validateData } from "../middlewares/validateData.middleware.js";
import { checkUsernameAvailability, getUserFollowers, getUserFollowing, getUserMutuals, getUserProfile, onboarding, suggestions, updateProfile } from "../controllers/user.controller.js";
import { apiLimiter, consume, searchLimiter } from "../libs/limiter/index.js";
import optionalAuth from "../middlewares/optionalAuth.middleware.js";

const router = express.Router();

router.post("/onboarding", consume(apiLimiter), requireAccessToken, validateData(createUserProfileSchema), onboarding);
router.get("/check-username", consume(searchLimiter), checkUsernameAvailability);
router.put("/profile/update", requireAccessToken, consume(apiLimiter, (req => req.userId!)), validateData(updateUserProfile), updateProfile);
router.get("/suggestions", consume(searchLimiter), requireAccessToken, suggestions);

router.get("/:userId/following", consume(apiLimiter), requireAccessToken, getUserFollowing);
router.get("/:userId/followers", consume(apiLimiter), requireAccessToken, getUserFollowers);
router.get("/:userId/mutuals", consume(apiLimiter), requireAccessToken, getUserMutuals);

router.get("/:username", consume(apiLimiter), optionalAuth, getUserProfile);

export default router;