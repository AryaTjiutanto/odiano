import express from "express";
import requireAccessToken from "../middlewares/requireAccessToken.middleware";
import { create, deleteFollowing } from "../controllers/following.controller";
import { consume, followingLimiter } from "../libs/limiter";

const router = express.Router();

router.post('/create', consume(followingLimiter), requireAccessToken, create);
router.delete('/delete', consume(followingLimiter), requireAccessToken, deleteFollowing);

export default router;