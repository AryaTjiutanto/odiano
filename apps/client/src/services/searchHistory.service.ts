import type { SearchTypes, SuccessResponseData } from "@odiano/shared";
import { api } from "../libs/api"

export const recordSearchHistory = async (targetId: string | undefined, type: SearchTypes, keyword?: string | null) => {
    const response = await api.post<SuccessResponseData<{id: string}>>("/search/history/record", {
        targetId,
        type,
        ...(keyword && { keyword })
    });

    return response.data;
}

export const deleteSearchHistory = async (historyId : string) => {
    const response = await api.delete<SuccessResponseData>(`/search/history/${historyId}`);

    return response.data;
}

export const deleteAllSearchHistory = async() => {
    const response = await api.delete<SuccessResponseData>(`/search/history/all`);

    return response.data;
}