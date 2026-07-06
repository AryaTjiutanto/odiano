import express from "express";
import { get as getSearchResult } from "../controllers/search.controller";
import { get as getSearchHistory } from "../controllers/searchHistory.controller";
import { apiLimiter, consume, searchLimiter } from "../libs/limiter";

const router = express.Router();

router.get("/", consume(searchLimiter), getSearchResult);
router.get("/history", consume(apiLimiter), getSearchHistory);

export default router;