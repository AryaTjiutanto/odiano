import express from 'express';
import { revokeSession, getActiveSessions, resendSessionVerification } from '../controllers/session.controller.js';
import requireRequestVerificationToken from '../middlewares/requireRequestVerificationToken.middleware.js';

const router = express.Router();

router.get("/active", getActiveSessions);
router.post("/:id", revokeSession)

router.post("/verification/resend", requireRequestVerificationToken, resendSessionVerification);

export default router;