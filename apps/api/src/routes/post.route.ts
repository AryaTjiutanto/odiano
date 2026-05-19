import express from "express"
import requireAccessToken from "../middlewares/requireAccessToken.middleware";
import {create} from "../controllers/post.controller";
import { consume } from "../libs/limiter";
import { createPostLimiter } from "../libs/limiter/limiters/createPost.limiter";
import {Request} from "express";

const router = express.Router();

router.post("/create", requireAccessToken, consume(createPostLimiter, (req : Request) => req.userId || "anonymous"), create);

export default router;