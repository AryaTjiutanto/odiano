import express from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);

export default router;