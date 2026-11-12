import type { AuthenticationResponse, SessionsDTO, SuccessResponseData } from "@odiano/shared";
import { api } from "../libs/api";
import REQUEST_HEADERS from "@odiano/shared/dist/request/request.const";
import { store } from "../app/store";
import { setCredentials } from "../features/auth/auth.slice";
import { getDeviceId } from "../helpers/deviceId";

export const getActiveSessions = async () : Promise<SessionsDTO> => {
    const response = await api.get<SuccessResponseData<SessionsDTO>>("/session/active");

    if(!response.data.data) {
        throw new Error("No data found")
    }
    
    return response.data.data;
}

export const revokeSession = async (sessionId : string) : Promise<boolean> => {
    const response = await api.post<SuccessResponseData>(`/session/${sessionId}`);
    
    return response.data.success;
}

export const resendSessionVerification = async () => {
    const token = store.getState().auth.requestVerificationToken;

    if(!token) {
        throw new Error("Require request verification token");
    }

    await api.post("/auth/session-verification/resend", {
        headers : {
            [REQUEST_HEADERS.REQUEST_VERIFICATION_TOKEN] : token,
        }
    });
}

export const verifySessionVerification = async (code : string) => {
    const token = store.getState().auth.requestVerificationToken;
    

    if(!token) {
        throw new Error("Require request verification token");
    }

    const response = await api.post<SuccessResponseData<AuthenticationResponse>>("/auth/session-verification/verify", {
        headers : {
            [REQUEST_HEADERS.REQUEST_VERIFICATION_TOKEN] : token,
        },
        data : {
            code,
            deviceId : getDeviceId()
        }
    });

    if(response.data.success || !response.data.data?.access_token) {
        throw new Error("Authentication fail");
    }

    store.dispatch(setCredentials(response.data.data?.access_token));
}