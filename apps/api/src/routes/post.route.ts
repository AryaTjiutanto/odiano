import requireAccessToken from "../middlewares/requireAccessToken.middleware";
import express from "express"
import {create, getUserPosts, index, show} from "../controllers/post.controller";
import { apiLimiter, consume } from "../libs/limiter";
import { createPostLimiter } from "../libs/limiter/limiters/createPost.limiter";
import { postIndexLimiter } from "../libs/limiter/limiters/postIndex.limiter";
import { createComment, getComments, getCurrentUserComments } from "../controllers/postComment.controller";
import { createPostCommentSchema } from "@connect/shared";
import createCommentLimiter from "../libs/limiter/limiters/createComment.limiter";
import { validateData } from "../middlewares/validateData.middleware";
import optionalAuth from "../middlewares/optionalAuth.middleware";

const router = express.Router();

router.get("/", consume(postIndexLimiter), index);
router.post("/create", requireAccessToken, consume(createPostLimiter), create);

// post user
router.get("/user/:username", consume(apiLimiter), getUserPosts);

// comments
router.post("/comments/create", consume(createCommentLimiter), requireAccessToken, validateData(createPostCommentSchema), createComment)
router.get("/:postId/comments/me", consume(apiLimiter), requireAccessToken, getCurrentUserComments)
router.get("/:postId/comments", consume(apiLimiter), optionalAuth, getComments)

// post detail
router.get("/:postPublicId", consume(apiLimiter), show);

export default router;