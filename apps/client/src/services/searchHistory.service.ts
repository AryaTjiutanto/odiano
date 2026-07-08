import type { SearchTypes, SuccessResponseData } from "@connect/shared";
import { api } from "../libs/api"

export const recordSearchHistory = async (targetId: string, type: SearchTypes, keyword?: string) => {
    const response = await api.post<SuccessResponseData>("/search/history/record", {
        targetId,
        type,
        ...(keyword && { keyword })
    });


    return response.data;
}