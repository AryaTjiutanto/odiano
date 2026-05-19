import express from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import uploadRoutes from "./upload.route";
import postRoutes from "./post.route";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/upload", uploadRoutes);
router.use("/post", postRoutes);

export default router;