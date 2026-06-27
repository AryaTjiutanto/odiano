import express from "express"
import { get, updateReadStatus } from "../controllers/notification.controller";

const router = express.Router();

router.get("/", get);
router.put("/update/read-status/:notificationId", updateReadStatus);

export default router;