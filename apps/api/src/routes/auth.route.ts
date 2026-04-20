import express from "express";
import { me, refresh, signin, signup } from "../controllers/auth.controller";
import { requireGuest } from "../middlewares/requireGuest.middleware";
import requireAccessToken from "../middlewares/requireAccessToken.middleware";
import { requireRefreshToken } from "../middlewares/requireRefreshToken.middleware";
import { validateData } from "../middlewares/validateData.middleware";
import { authenticateUserSchema, createUserSchema } from "@connect/shared";

const router = express.Router();

router.post("/signin", requireGuest, validateData(authenticateUserSchema), signin);
router.post("/signup", requireGuest, validateData(createUserSchema), signup);
router.get("/me", requireAccessToken, me);
router.post("/refresh", requireRefreshToken, refresh);

export default router;