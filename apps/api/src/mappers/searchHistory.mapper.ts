import { SEARCH_HISTORY_TYPES, searchHistoryDTO, UserSummaryDTO } from "@connect/shared";
import { searchHistoryQuery } from "../types/searchHistory.type";

export const toSearchHistoryDTO = (data : searchHistoryQuery, usersMap? : Map<String,UserSummaryDTO>) : searchHistoryDTO => {
    return {
        keyword : data.keyword,
        type : data.type,
        user : data.user.toString(),
        targetId : data.targetId.toString(),
        ...(data.type == SEARCH_HISTORY_TYPES.USER && {targetData : usersMap?.get(data.targetId.toString())})
    }
}