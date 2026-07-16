import express from "express";
import { checkFollowing, create, deleteFollowing } from "../controllers/following.controller";
import { apiLimiter, consume, followingLimiter } from "../libs/limiter";
import requireAccessToken from "../middlewares/requireAccessToken.middleware";

const router = express.Router();

router.post('/create', consume(followingLimiter), requireAccessToken, create);
router.delete('/delete', consume(followingLimiter), requireAccessToken, deleteFollowing);
router.get('/check/:userId', consume(apiLimiter), checkFollowing);

export default router;