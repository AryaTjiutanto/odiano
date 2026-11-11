import { AUTH_TOKEN, type VerificationResponse, type AuthenticateUserSchema, type AuthenticationResponse, type SuccessResponseData } from "@odiano/shared";
import { api } from "../libs/api";
import { getDeviceId } from "../helpers/deviceId";
import { store } from "../app/store";
import { requireSessionVerification, setAccessToken } from "../features/auth/auth.slice";
import { intitializeAuth } from "../features/auth/auth.thunk";

export const googleAuth = async (credential: string) => {
    const result = await api.post<SuccessResponseData<AuthenticationResponse>>("/auth/google", { credential, deviceId: getDeviceId() });

    return result;
}

export const signin = async (data: AuthenticateUserSchema): Promise<VerificationResponse<AuthenticationResponse>> => {
    const response = await api.post<SuccessResponseData<VerificationResponse<AuthenticationResponse>>>("/auth/signin", data);

    const responseData = response.data.data;

    if(!responseData) {
        throw new Error("Data is empty")
    }

    // check is require verification
    if (responseData.requireVerification) {
        store.dispatch(requireSessionVerification(responseData.requestVerificationToken));
    } else {
        const accessToken = responseData?.[AUTH_TOKEN.ACCESS];

        if (accessToken) {
            store.dispatch(setAccessToken(accessToken));
            store.dispatch(intitializeAuth());
        }
    }

    return responseData;
}