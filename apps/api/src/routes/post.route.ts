import express from "express"
import requireAccessToken from "../middlewares/requireAccessToken.middleware";
import {create, index} from "../controllers/post.controller";
import { consume } from "../libs/limiter";
import { createPostLimiter } from "../libs/limiter/limiters/createPost.limiter";
import {Request} from "express";
import { postIndexLimiter } from "../libs/limiter/limiters/postIndex.limiter";

const router = express.Router();

router.get("/", consume(postIndexLimiter), index);

router.post("/create", requireAccessToken, consume(createPostLimiter, (req : Request) => req.userId || "anonymous"), create);

export default router;