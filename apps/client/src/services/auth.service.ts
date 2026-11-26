import { AUTH_TOKEN, type VerificationResponse, type AuthenticateUserSchema, type AuthenticationResponse, type SuccessResponseData } from "@odiano/shared";
import { api } from "../libs/api";
import { getDeviceId } from "../helpers/deviceId";
import { store } from "../app/store";
import { requireSessionVerification, setCredentials } from "../features/auth/auth.slice";
import { initializeAuth } from "../features/auth/auth.thunk";
import { setRequireVerification } from "../helpers/verificationChallenge.helper";

export const googleAuth = async (credential: string) => {
    const result = await api.post<SuccessResponseData<AuthenticationResponse>>("/auth/google", { credential, deviceId: getDeviceId() });

    return result;
}

export const signin = async (data: AuthenticateUserSchema): Promise<VerificationResponse<AuthenticationResponse>> => {
    const response = await api.post<SuccessResponseData<VerificationResponse<AuthenticationResponse>>>("/auth/signin", data);

    const responseData = response.data.data;

    if (!responseData) {
        throw new Error("Data is empty")
    }

    // check is require verification
    if (responseData.requireVerification) {
        store.dispatch(requireSessionVerification(responseData.requestVerificationToken));
        
        setRequireVerification();
    } else {
        const accessToken = responseData?.[AUTH_TOKEN.ACCESS];

        if (accessToken) {
            store.dispatch(setCredentials(accessToken));
            store.dispatch(initializeAuth());
        }
    }

    return responseData;
}

export const getRequestVerificationToken = async () : Promise<string | null> => {
    const response = await api.get<SuccessResponseData<VerificationResponse<AuthenticationResponse>>>("/auth/verification-challenge/token");

    const responseData = response.data.data;

    if (!responseData) {
        throw new Error("Data is empty")
    }
    
    if (!responseData.requireVerification) return null;

    return responseData.requestVerificationToken;
}