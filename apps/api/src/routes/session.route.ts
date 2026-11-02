import express from 'express';
import { getSessions } from '../controllers/session.controller.js';

const router = express.Router();

router.get("/", getSessions);

export default router;