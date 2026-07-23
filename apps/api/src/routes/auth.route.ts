import express from "express";
import { googleAuth, logout, me, refresh, resendEmailVerification, signin, signup, verifyEmail } from "../controllers/auth.controller";
import { requireGuest } from "../middlewares/requireGuest.middleware";
import requireAccessToken from "../middlewares/requireAccessToken.middleware";
import { requireRefreshToken } from "../middlewares/requireRefreshToken.middleware";
import { validateData } from "../middlewares/validateData.middleware";
import { authenticateUserSchema, createUserSchema } from "@connect/shared";
import { apiLimiter, consume, otpLimiter, refreshLimiter, signinLimiter, signupLimiter, verifyLimiter } from "../libs/limiter";

const router = express.Router();

router.post("/signin", consume(signinLimiter), requireGuest, validateData(authenticateUserSchema), signin);
router.post("/signup", consume(signupLimiter), requireGuest, validateData(createUserSchema), signup);
router.get("/me", consume(apiLimiter), requireAccessToken, me);
router.post("/refresh", consume(refreshLimiter), requireRefreshToken, refresh);
router.post("/logout", logout);

router.post("/email-verification/resend", consume(otpLimiter), requireAccessToken, resendEmailVerification);
router.post("/email-verification/verify", consume(verifyLimiter), requireAccessToken, verifyEmail);

router.post("/google", consume(signinLimiter), requireGuest, googleAuth);

export default router;