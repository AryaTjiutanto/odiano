import express from 'express';
import { deleteSession, getSessions } from '../controllers/session.controller.js';

const router = express.Router();

router.get("/", getSessions);
router.delete("/:id", deleteSession)

export default router;