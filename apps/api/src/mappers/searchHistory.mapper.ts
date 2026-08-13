import { HashTagSearchDTO, HashTagSummaryDTO, SEARCH_TYPES, SearchHistoryDTO, UserSearchDTO, UserSummaryDTO } from "@odiano/shared";
import { searchHistoryQuery } from "../types/searchHistory.type";

type searchHistoryTargetData = {
    users: Map<String, UserSummaryDTO>,
    hashtags: Map<String, HashTagSummaryDTO>,
};

export const toSearchHistoryDTO = (data: searchHistoryQuery, targetData: searchHistoryTargetData): SearchHistoryDTO => {
    return {
        id: data._id.toString(),
        keyword: data.keyword,
        user: data.user.toString(),
        targetId: data.targetId.toString(),
        ...((data.type == SEARCH_TYPES.USER) && {
            target: {
                type: SEARCH_TYPES.USER,
                data: targetData.users.get(data.targetId.toString()) || null
            } satisfies UserSearchDTO,
        }),
        ...(data.type == SEARCH_TYPES.HASHTAG && {
            target: {
                type: SEARCH_TYPES.HASHTAG,
                data: targetData.hashtags.get(data.targetId.toString()) || null
            } satisfies HashTagSearchDTO,
        }),
        updatedAt: data.updatedAt
    }
}