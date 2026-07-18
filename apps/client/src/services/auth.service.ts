import type { AuthenticationResponse, SuccessResponseData } from "@connect/shared";
import { api } from "../libs/api";

export const googleAuth = async (credential : string) => {
    const result = await api.post<SuccessResponseData<AuthenticationResponse>>("/auth/google", {credential});

    return result;
}