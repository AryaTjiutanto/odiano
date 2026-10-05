import express from "express";
import { deleteAllHistory, deleteHistory, get as getSearchHistory, record } from "../controllers/searchHistory.controller.js";
import { apiLimiter, consume, searchLimiter } from "../libs/limiter/index.js";
import { validateData } from "../middlewares/validateData.middleware.js";
import { searchQuerySchema } from "../validations/search.validation.js";
import requireAccessToken from "../middlewares/requireAccessToken.middleware.js";
import { getPostsSearchResult, getSuggestions, getUsersSearchResult } from "../controllers/search.controller.js";

const router = express.Router();

router.get("/posts", consume(searchLimiter), requireAccessToken, validateData(searchQuerySchema, "query"), getPostsSearchResult);
router.get("/users", consume(searchLimiter), requireAccessToken, validateData(searchQuerySchema, "query"), getUsersSearchResult);

router.get("/suggestions", consume(searchLimiter), requireAccessToken, validateData(searchQuerySchema, "query"), getSuggestions);
router.get("/history", consume(apiLimiter), requireAccessToken, getSearchHistory);
router.post("/history/record", consume(apiLimiter), requireAccessToken, record);
router.delete("/history/all", consume(apiLimiter), requireAccessToken, deleteAllHistory);
router.delete("/history/:id", consume(apiLimiter), requireAccessToken, deleteHistory);

export default router;