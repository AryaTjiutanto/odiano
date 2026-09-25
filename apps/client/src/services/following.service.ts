import type { SuccessResponseData } from "@odiano/shared";
import { api } from "../libs/api";
import type { IsFollowingData } from "../types/following.type";

export const createFollowing = async (userId: string | undefined) => {
    if (!userId) {
        throw new Error("Follow user id is missing");
    };

    await api.post<SuccessResponseData>('following/create', {
        data: {
            targetUserId : userId,
        }
    });

    return true;
}

export const deleteFollowing = async (userId: string | undefined) => {
    if (!userId) {
        throw new Error("Follow user id is missing");
    };

    await api.delete<SuccessResponseData>('following/delete', {
        data: {
            targetUserId : userId,
        }
    });

    return true;
}

export const getIsFollowingInformation = async (userId : string | undefined) => {
    if (!userId) {
        throw new Error("userId is missing");
    };

    const response = await api.get<SuccessResponseData<IsFollowingData>>(`/following/check/${userId}`);

    return response.data.data;
}