import { SEARCH_HISTORY_LIMIT } from "../consts/searchHistory.const"
import SearchHistory from "../models/searchHistory.model"

export const getSearchHistory = () => {
    const searchHistories = SearchHistory.find().limit(SEARCH_HISTORY_LIMIT + 1);


}