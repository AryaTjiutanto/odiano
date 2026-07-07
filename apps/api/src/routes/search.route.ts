import express from "express";
import { get as getSearchResult } from "../controllers/search.controller";
import { get as getSearchHistory, record } from "../controllers/searchHistory.controller";
import { apiLimiter, consume, searchLimiter } from "../libs/limiter";
import { validateData } from "../middlewares/validateData.middleware";
import { searchQuerySchema } from "../validations/search.validation";

const router = express.Router();

router.get("/", consume(searchLimiter), validateData(searchQuerySchema, "query"), getSearchResult);
router.get("/history", consume(apiLimiter), getSearchHistory);
router.post("/history/record", consume(apiLimiter), record)

export default router;