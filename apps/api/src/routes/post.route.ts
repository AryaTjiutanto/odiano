import requireAccessToken from "../middlewares/requireAccessToken.middleware";
import express from "express"
import {create, index, show} from "../controllers/post.controller";
import { apiLimiter, consume } from "../libs/limiter";
import { createPostLimiter } from "../libs/limiter/limiters/createPost.limiter";
import { postIndexLimiter } from "../libs/limiter/limiters/postIndex.limiter";

const router = express.Router();

router.get("/", consume(postIndexLimiter), index);
router.post("/create", requireAccessToken, consume(createPostLimiter), create);

router.get("/:postPublicId", consume(apiLimiter), show)

export default router;