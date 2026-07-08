import express from "express";
import { get as getSearchResult } from "../controllers/search.controller";
import { get as getSearchHistory, record } from "../controllers/searchHistory.controller";
import { apiLimiter, consume, searchLimiter } from "../libs/limiter";
import { validateData } from "../middlewares/validateData.middleware";
import { searchQuerySchema } from "../validations/search.validation";
import optionalAuth from "../middlewares/optionalAuth.middleware";

const router = express.Router();

router.get("/", consume(searchLimiter), validateData(searchQuerySchema, "query"), getSearchResult);
router.get("/history", consume(apiLimiter), optionalAuth, getSearchHistory);
router.post("/history/record", consume(apiLimiter), optionalAuth, record)

export default router;