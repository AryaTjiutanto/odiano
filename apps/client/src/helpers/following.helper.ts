import type { SuccessResponseData } from "@connect/shared";
import { store } from "../app/store"
import { api } from "../libs/api";

export const createFollowing = async (followUserId: string | undefined) => {
    const currentUserId = store.getState().auth.user?.id;

    if (!followUserId) {
        throw new Error("Follow user id is missing");
    };

    await api.post<SuccessResponseData>('following/create', {
        data: {
            userId: currentUserId,
            followUserId,
        }
    });

    return true;
}

export const deleteFollowing = async (followUserId: string | undefined) => {
    const currentUserId = store.getState().auth.user?.id;

    if (!followUserId) {
        throw new Error("Follow user id is missing");
    };

    await api.delete<SuccessResponseData>('following/delete', {
        data: {
            userId: currentUserId,
            followUserId,
        }
    });

    return true;
}