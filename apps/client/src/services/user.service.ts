import type { CreateUserProfileSchema, InfiniteQuery, SuccessResponseData, UpdateUserProfile, UserProfileDTO, UserSummaryDTO } from "@odiano/shared";
import { api } from "../libs/api";

export const getUserProfile = async (username: string): Promise<UserProfileDTO> => {
    const response = await api.get<SuccessResponseData<UserProfileDTO>>(`users/${username}`);

    if (!response.data.data) {
        throw new Error("User not found");
    }

    return response.data.data;
}

export const createUserProfile = async (data: CreateUserProfileSchema): Promise<SuccessResponseData> => {
    const response = await api.post<SuccessResponseData>("/users/onboarding", data);

    if (!response.data.success) {
        throw new Error("Error went create user profile");
    }

    return response.data;
}

export const checkUsername = async (username: string): Promise<boolean> => {
    const response = await api.get<SuccessResponseData<{ available: boolean }>>("/users/check-username", {
        params: {
            username,
        }
    });

    if (!response.data.data) {
        throw new Error("Data is missing");
    }

    return response.data.data?.available;
}

export const updateProfile = async (data: UpdateUserProfile): Promise<SuccessResponseData> => {
    const response = await api.put<SuccessResponseData>(`/users/profile/update`, data);

    return response.data;
}

export const getSuggestedUsers = async (): Promise<UserSummaryDTO[]> => {
    const response = await api.get<SuccessResponseData<UserSummaryDTO[]>>("/users/suggestions");

    if (!response.data.data) {
        throw new Error("Data is missing");
    }

    return response.data.data;
}

export const getUserFollowing = async (userId: string) => {
    const response = await api.get<SuccessResponseData<InfiniteQuery<UserSummaryDTO[]>>>(`/users/${userId}/following`);

    return response.data.data;
}

export const getUserFollowers = async (userId: string) => {
    const response = await api.get<SuccessResponseData<InfiniteQuery<UserSummaryDTO[]>>>(`/users/${userId}/followers`);

    return response.data.data;
}