import type { SessionsDTO, SuccessResponseData } from "@odiano/shared";
import { api } from "../libs/api";

export const getSessions = async () : Promise<SessionsDTO> => {
    const response = await api.get<SuccessResponseData<SessionsDTO>>("/session");

    if(!response.data.data) {
        throw new Error("No data found")
    }
    
    return response.data.data;
}