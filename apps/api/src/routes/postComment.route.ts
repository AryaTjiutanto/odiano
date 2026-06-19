import express from "express";
import requireAccessToken from "../middlewares/requireAccessToken.middleware";
import { create } from "../controllers/postComment.controller";

const router = express.Router();

router.post("/create", requireAccessToken, create);

export default router;