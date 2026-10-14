import express from "express"
import { get, getUnreadCount, updateAllReadStatus, updateReadStatus } from "../controllers/notification.controller.js";
import { apiLimiter, consume } from "../libs/limiter/index.js";

const router = express.Router();

router.get("/", consume(apiLimiter), get);
router.get("/unread-count", consume(apiLimiter), getUnreadCount);
router.patch("/update/read-all", consume(apiLimiter), updateAllReadStatus);
router.patch("/update/read-status/:notificationId", consume(apiLimiter), updateReadStatus);

export default router;