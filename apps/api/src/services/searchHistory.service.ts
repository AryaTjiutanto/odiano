import { SEARCH_HISTORY_TYPES, searchHistoryDTO } from "@connect/shared";
import { SEARCH_HISTORY_LIMIT } from "../consts/searchHistory.const"
import SearchHistory from "../models/searchHistory.model"
import { User } from "../models/user.model";
import { UserSummaryQuery } from "../types/user.type";
import { searchHistoryQuery } from "../types/searchHistory.type";
import { toUserSummaryDTO } from "../mapper/user.mapper";
import { toSearchHistoryDTO } from "../mapper/searchHistory.mapper";

export const getSearchHistory = async () : Promise<searchHistoryDTO[]> => {
    const searchHistories = await SearchHistory.find()
    .limit(SEARCH_HISTORY_LIMIT)
    .lean<searchHistoryQuery[]>();

    // get user summary
    const userHistories = searchHistories.filter((search) => search.type == SEARCH_HISTORY_TYPES.USER);
    const userIds = userHistories.map(h => h.targetId);
    const userSummaries = await User.find({ _id : {$in : userIds} })
    .select("_id name username profileImage")
    .lean<UserSummaryQuery[]>();
    
    const usersMap = new Map(userSummaries.map((user) => [user._id.toString(), toUserSummaryDTO(user)]));
    
    // organize data
    const searchHistoriesDTO = searchHistories.map((history) => toSearchHistoryDTO(history, usersMap));

    return searchHistoriesDTO
}