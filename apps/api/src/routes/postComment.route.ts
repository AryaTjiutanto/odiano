import express from "express";
import requireAccessToken from "../middlewares/requireAccessToken.middleware";
import { create } from "../controllers/postComment.controller";
import { validateData } from "../middlewares/validateData.middleware";
import { createPostCommentSchema } from "@connect/shared";

const router = express.Router();

router.post("/create", requireAccessToken, validateData(createPostCommentSchema), create);

export default router;