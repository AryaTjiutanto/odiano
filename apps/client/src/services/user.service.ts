import type { CreateUserProfileSchema, SuccessResponseData, UserProfileDTO } from "@connect/shared";
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

export const checkUsername = async (username : string) : Promise<boolean> => {
    const response = await api.get<SuccessResponseData<{ available: boolean }>>("/users/check-username", {
        params: {
            username,
        }
    });

    if(!response.data.data) {
        throw new Error("Data is missing");
    }

    return response.data.data?.available;
}