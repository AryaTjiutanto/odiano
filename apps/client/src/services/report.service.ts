import type { PaginationQuery, ReportDTO, ReportReasonCode, ReportStatus, ReportType, SuccessResponseData } from "@odiano/shared";
import { api } from "../libs/api";

type ReportOptions = {
    status : ReportStatus,
    page? : number,
    withPagination? : boolean,
}

export const createReport = async (reasonCode : ReportReasonCode, targetId : string, targetType : ReportType) => {
    const response = await api.post<SuccessResponseData>(`/report/create`, {
        reason : reasonCode,
        type : targetType,        
        targetId,
    })

    return response.data;
}

export const getReportList = async (options : ReportOptions) : Promise<PaginationQuery<ReportDTO[]>> => {
    console.log("hello");
    const response = await api.get<SuccessResponseData<PaginationQuery<ReportDTO[]>>>(`/report`, {
        params : {
            status : options.status,
            page : options.page || 1,
            ...(options.withPagination && { withPagination : true }),
        }
    });

    if(!response.data.data) {
        throw new Error("No data found");
    }

    return response.data.data;
}