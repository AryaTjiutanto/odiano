import express from "express"
import { get, updateReadStatus } from "../controllers/notification.controller";
import { apiLimiter, consume } from "../libs/limiter";

const router = express.Router();

router.get("/", consume(apiLimiter), get);
router.put("/update/read-status/:notificationId", consume(apiLimiter), updateReadStatus);

export default router;