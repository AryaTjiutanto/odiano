import type { InfiniteQuery, PostDTO, SearchSuggestionDTO, SuccessResponseData, UserSummaryDTO } from "@odiano/shared";
import { api } from "../libs/api";

export const getPostsSearchResult = async (query : string | undefined | null, type : "all" | "media", cursor : string | undefined | null) : Promise<InfiniteQuery<PostDTO[]>> => {
    const response = await api.get<SuccessResponseData<InfiniteQuery<PostDTO[]>>>("search/posts", {
        params: {
            q: query,
            cursor,
            ...(type == "media" && { onlyMedia : true }),
        }
    })

    if (!response.data.data) {
        throw new Error("Data is empty");
    }
   
    return response.data.data;
}

export const getUsersSearchResult = async (query : string | undefined | null) : Promise<UserSummaryDTO[]> => {
    const response = await api.get<SuccessResponseData<UserSummaryDTO[]>>("search/users", {
        params: {
            q: query?.replace(/^#/, ""),
        }
    })

    if (!response.data.data) {
        throw new Error("Data is empty");
    }
   
    return response.data.data;
}

export const getSearchSuggestions = async (query : string | undefined | null) : Promise<SearchSuggestionDTO[]> => {
    const response = await api.get<SuccessResponseData<SearchSuggestionDTO[]>>("search/suggestions", {
        params: {
            q: query,
        }
    })

    if (!response.data.data) {
        throw new Error("Data is empty");
    }

    return response.data.data;
}