import type { InfiniteQuery, PostDTO, SearchSuggestionDTO, SuccessResponseData } from "@odiano/shared";
import { api } from "../libs/api";

export const getSearchResult = async (query : string | undefined | null, cursor? : string | undefined | null) : Promise<InfiniteQuery<PostDTO[]>> => {
    const response = await api.get<SuccessResponseData<InfiniteQuery<PostDTO[]>>>("search", {
        params: {
            q: query,
            cursor,
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