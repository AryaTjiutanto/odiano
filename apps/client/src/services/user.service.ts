import type { SuccessResponseData, UserProfileDTO } from "@connect/shared";
import { api } from "../libs/api";

export const getUserProfile = async (username : string) : Promise<UserProfileDTO> => {
    const response = await api.get<SuccessResponseData<UserProfileDTO>>(`users/${username}`);
    
    if (!response.data.data) {
        throw new Error("User not found");
    }

    return response.data.data;
}