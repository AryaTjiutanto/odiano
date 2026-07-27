import { SEARCH_TYPES, SearchHistoryDTO, UserSummaryDTO } from "@odiano/shared";
import { searchHistoryQuery } from "../types/searchHistory.type";

export const toSearchHistoryDTO = (data : searchHistoryQuery, usersMap? : Map<String,UserSummaryDTO>) : SearchHistoryDTO => {
    return {
        id : data._id.toString(),
        keyword : data.keyword,
        type : data.type,
        user : data.user.toString(),
        targetId : data.targetId.toString(),
        ...(data.type == SEARCH_TYPES.USER && {targetData : usersMap?.get(data.targetId.toString())}),
        updatedAt : data.updatedAt
    }
}