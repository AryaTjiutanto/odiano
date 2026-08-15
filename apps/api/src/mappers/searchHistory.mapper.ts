import { GeneralSearchDTO, HashTagSearchDTO, HashTagSummaryDTO, SEARCH_TYPES, SearchHistoryDTO, UserSearchDTO, UserSummaryDTO } from "@odiano/shared";
import { searchHistoryQuery } from "../types/searchHistory.type";

type searchHistoryTargetData = {
    users: Map<string, UserSummaryDTO>,
    hashtags: Map<string, HashTagSummaryDTO>,
};

export const toSearchHistoryDTO = (data: searchHistoryQuery, targetData: searchHistoryTargetData): SearchHistoryDTO => {
    return {
        id: data._id.toString(),
        keyword: data.keyword,
        user: data.user.toString(),
        targetId: data.targetId?.toString(),
        ...((data.type == SEARCH_TYPES.USER && data.targetId) && {
            target: {
                type: SEARCH_TYPES.USER,
                data: targetData.users.get(data.targetId.toString()) || null,
                keyword : null
            } satisfies UserSearchDTO,
        }),
        ...((data.type == SEARCH_TYPES.HASHTAG && data.targetId) && {
            target: {
                type: SEARCH_TYPES.HASHTAG,
                data: targetData.hashtags.get(data.targetId.toString()) || null,
                keyword : null
            } satisfies HashTagSearchDTO,
        }),
        ...((data.type == SEARCH_TYPES.GENERAL) && {
            target: {
                type: SEARCH_TYPES.GENERAL,
                data: null,
                keyword : data.keyword || null
            } satisfies GeneralSearchDTO,
        }),
        updatedAt: data.updatedAt
    }
}