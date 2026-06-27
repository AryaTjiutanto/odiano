import express from "express";
import { checkFollowing, create, deleteFollowing } from "../controllers/following.controller";

const router = express.Router();

router.post('/create', create);
router.delete('/delete', deleteFollowing);
router.get('/check/:userId', checkFollowing);

export default router;