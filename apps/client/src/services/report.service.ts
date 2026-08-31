import type { ReportReasonCode, ReportType, SuccessResponseData } from "@odiano/shared";
import { api } from "../libs/api";

export const createReport = async (reasonCode : ReportReasonCode, targetId : string, targetType : ReportType) => {
    const response = await api.post<SuccessResponseData>(`/report/create`, {
        reason : reasonCode,
        type : targetType,        
        targetId,
    })

    return response.data;
}