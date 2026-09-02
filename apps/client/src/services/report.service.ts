import type { ReportReasonCode, ReportStatus, ReportType, SuccessResponseData } from "@odiano/shared";
import { api } from "../libs/api";

export const createReport = async (reasonCode : ReportReasonCode, targetId : string, targetType : ReportType) => {
    const response = await api.post<SuccessResponseData>(`/report/create`, {
        reason : reasonCode,
        type : targetType,        
        targetId,
    })

    return response.data;
}

export const getReportList = async (status : ReportStatus) => {
    const response = await api.get<SuccessResponseData>(`/report`, {
        params : {
            status,
            page : 1,
        }
    });

    return response.data;
}