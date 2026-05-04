import express from "express";
import requireAccessToken from "../middlewares/requireAccessToken.middleware";
import { createUserProfileSchema } from "@connect/shared";
import { validateData } from "../middlewares/validateData.middleware";
import { checkUsernameAvailability, onboarding } from "../controllers/user.controller";

const router = express.Router();

router.post("/onboarding", requireAccessToken, validateData(createUserProfileSchema), onboarding);
router.get("/check-username", checkUsernameAvailability);

export default router;