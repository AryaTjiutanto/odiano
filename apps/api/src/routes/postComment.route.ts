import express from "express";
import requireAccessToken from "../middlewares/requireAccessToken.middleware";
import { create, get } from "../controllers/postComment.controller";
import { validateData } from "../middlewares/validateData.middleware";
import { createPostCommentSchema } from "@connect/shared";
import { apiLimiter, consume } from "../libs/limiter";
import createCommentLimiter from "../libs/limiter/limiters/createComment.limiter";

const router = express.Router();

router.post("/create", consume(createCommentLimiter), requireAccessToken, validateData(createPostCommentSchema), create);
router.get("/get", consume(apiLimiter), get)

export default router;