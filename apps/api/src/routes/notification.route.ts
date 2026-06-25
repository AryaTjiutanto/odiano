import express from "express"
import { get } from "../controllers/notification.controller";

const router = express.Router();

router.get("/", get);

export default router;