import requireAccessToken from "../middlewares/requireAccessToken.middleware";
import express from "express"
import { create as createPost, deletePost, getUserPosts, index as indexPost, show as showPost } from "../controllers/post.controller";
import { createComment, deleteComment, getComments, getCurrentUserComments } from "../controllers/postComment.controller";
import { createPostCommentSchema, createPostSchema } from "@odiano/shared";
import { validateData } from "../middlewares/validateData.middleware";
import optionalAuth from "../middlewares/optionalAuth.middleware";
import { createPostLike, deletePostLike } from "../controllers/like.controller";
import { apiLimiter, consume, createPostLimiter, likeLimiter, postIndexLimiter } from "../libs/limiter";
import commentLimiter from "../libs/limiter/limiters/createComment.limiter";

const router = express.Router();

router.get("/", consume(postIndexLimiter), optionalAuth, indexPost);
router.post("/create", requireAccessToken, consume(createPostLimiter), validateData(createPostSchema), createPost);

// post user
router.get("/user/:username", consume(apiLimiter), optionalAuth, getUserPosts);

// like
router.post("/:postId/like", consume(likeLimiter), requireAccessToken, createPostLike)
router.delete("/:postId/like/delete", consume(likeLimiter), requireAccessToken, deletePostLike)

// comments
router.post("/comment/create", consume(commentLimiter), requireAccessToken, validateData(createPostCommentSchema), createComment)
router.delete("/comment/:commentId", consume(commentLimiter), requireAccessToken, deleteComment)
router.get("/:postId/comments/me", consume(apiLimiter), requireAccessToken, getCurrentUserComments)
router.get("/:postId/comments", consume(apiLimiter), optionalAuth, getComments)

// post detail
router.get("/:postPublicId", consume(apiLimiter), optionalAuth, showPost);

// delete post
router.delete("/:postId", consume(apiLimiter), requireAccessToken, deletePost);

export default router;