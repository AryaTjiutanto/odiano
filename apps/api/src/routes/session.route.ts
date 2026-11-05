import express from 'express';
import { revokeSession, getActiveSessions } from '../controllers/session.controller.js';

const router = express.Router();

router.get("/active", getActiveSessions);
router.post("/:id", revokeSession)

export default router;