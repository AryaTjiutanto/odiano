import type { SessionsDTO, SuccessResponseData } from "@odiano/shared";
import { api } from "../libs/api";

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