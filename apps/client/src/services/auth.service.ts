import type { AuthenticationResponse, SuccessResponseData } from "@odiano/shared";
import { api } from "../libs/api";
import { getDeviceId } from "../helpers/deviceId";

export const googleAuth = async (credential: string) => {
    const result = await api.post<SuccessResponseData<AuthenticationResponse>>("/auth/google", { credential, deviceId : getDeviceId()});

    return result;
}