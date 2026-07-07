import type { SearchDTO, SuccessResponseData } from "@connect/shared";
import { api } from "../libs/api";

export const getSearchResult = async (query : string | undefined | null) : Promise<SearchDTO> => {
    const response = await api.get<SuccessResponseData<SearchDTO>>("search/", {
        params: {
            q: query,
        }
    })

    if (!response.data.data) {
        throw new Error("Data is empty");
    }

    return response.data.data;
}