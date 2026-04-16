import express from "express";
import { me, signin, signup } from "../controllers/auth";


const router = express.Router();

router.post("/signin", signin);
router.post("/singup", signup);
router.get("/me", me);

export default router;