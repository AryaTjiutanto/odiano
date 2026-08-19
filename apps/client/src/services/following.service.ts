import type { SuccessResponseData } from "@odiano/shared";
import { api } from "../libs/api";

export const createFollowing = async (followUserId: string | undefined) => {
    if (!followUserId) {
        throw new Error("Follow user id is missing");
    };

    await api.post<SuccessResponseData>('following/create', {
        data: {
            followUserId,
        }
    });

    return true;
}

export const deleteFollowing = async (followUserId: string | undefined) => {
    if (!followUserId) {
        throw new Error("Follow user id is missing");
    };

    await api.delete<SuccessResponseData>('following/delete', {
        data: {
            followUserId,
        }
    });

    return true;
}