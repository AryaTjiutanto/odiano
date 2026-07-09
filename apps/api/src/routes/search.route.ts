import express from "express";
import { get as getSearchResult } from "../controllers/search.controller";
import { deleteAllHistory, deleteHistory, get as getSearchHistory, record } from "../controllers/searchHistory.controller";
import { apiLimiter, consume, searchLimiter } from "../libs/limiter";
import { validateData } from "../middlewares/validateData.middleware";
import { searchQuerySchema } from "../validations/search.validation";
import optionalAuth from "../middlewares/optionalAuth.middleware";
import requireAccessToken from "../middlewares/requireAccessToken.middleware";

const router = express.Router();

router.get("/", consume(searchLimiter), validateData(searchQuerySchema, "query"), getSearchResult);
router.get("/history", consume(apiLimiter), optionalAuth, getSearchHistory);
router.post("/history/record", consume(apiLimiter), requireAccessToken, record);
router.delete("/history/all", consume(apiLimiter), requireAccessToken, deleteAllHistory);
router.delete("/history/:id", consume(apiLimiter), requireAccessToken, deleteHistory);

export default router;