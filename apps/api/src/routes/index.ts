import express from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import uploadRoutes from "./upload.route";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/upload", uploadRoutes);

export default router;