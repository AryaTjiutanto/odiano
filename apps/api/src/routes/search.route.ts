import express from "express";
import { deleteAllHistory, deleteHistory, get as getSearchHistory, record } from "../controllers/searchHistory.controller";
import { apiLimiter, consume, searchLimiter } from "../libs/limiter";
import { validateData } from "../middlewares/validateData.middleware";
import { searchQuerySchema } from "../validations/search.validation";
import requireAccessToken from "../middlewares/requireAccessToken.middleware";
import { getPostsSearchResult, getSuggestions, getUsersSearchResult } from "../controllers/search.controller";

const router = express.Router();

router.get("/posts", consume(searchLimiter), requireAccessToken, validateData(searchQuerySchema, "query"), getPostsSearchResult);
router.get("/users", consume(searchLimiter), requireAccessToken, validateData(searchQuerySchema, "query"), getUsersSearchResult);

router.get("/suggestions", consume(searchLimiter), requireAccessToken, validateData(searchQuerySchema, "query"), getSuggestions);
router.get("/history", consume(apiLimiter), requireAccessToken, getSearchHistory);
router.post("/history/record", consume(apiLimiter), requireAccessToken, record);
router.delete("/history/all", consume(apiLimiter), requireAccessToken, deleteAllHistory);
router.delete("/history/:id", consume(apiLimiter), requireAccessToken, deleteHistory);

export default router;