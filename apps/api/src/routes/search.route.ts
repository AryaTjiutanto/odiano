import express from "express";
import { get } from "../controllers/search.controller";

const router = express.Router();

router.get("/", get);

export default router;