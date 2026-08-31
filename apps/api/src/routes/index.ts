import express from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import uploadRoutes from "./upload.route";
import postRoutes from "./post.route";
import followingRoutes from "./following.route";
import notificationRoutes from "./notification.route";
import requireAccessToken from "../middlewares/requireAccessToken.middleware";
import searchRoutes from "./search.route";
import reportRoutes  from "./report.route";
import { apiLimiter, consume, followingLimiter } from "../libs/limiter";
import { reportLimiter } from "../libs/limiter/limiters/report.limiter";

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