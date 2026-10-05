import express from "express";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import uploadRoutes from "./upload.route.js";
import postRoutes from "./post.route.js";
import followingRoutes from "./following.route.js";
import notificationRoutes from "./notification.route.js";
import requireAccessToken from "../middlewares/requireAccessToken.middleware.js";
import searchRoutes from "./search.route.js";
import reportRoutes  from "./report.route.js";
import { apiLimiter, consume, followingLimiter } from "../libs/limiter/index.js";
import { reportLimiter } from "../libs/limiter/limiters/report.limiter.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/upload", uploadRoutes);
router.use("/post", postRoutes);
router.use("/following", consume(followingLimiter), requireAccessToken, followingRoutes);
router.use('/notification', consume(apiLimiter), requireAccessToken, notificationRoutes);
router.use('/report', consume(reportLimiter), requireAccessToken, reportRoutes)
router.use('/search', searchRoutes);

export default router;