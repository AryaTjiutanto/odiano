import { PostMedia, REPORT_TYPE, ReportReasonCode, ReportStatus, UserSummaryDTO } from "@odiano/shared";
import { ImageAsset, UserSummaryQuery } from "./user.type";

// get reporter data

type PostReportTarget = {
    type: typeof REPORT_TYPE.POST,
    data: {
        _id: string,
        publicId: string,
        content: string,
        media: PostMedia[],
    },
}

type UserReportTarget = {
    type: typeof REPORT_TYPE.USER,
    data: {
        _id : string,
        username : string,
        profileImage : ImageAsset,
    },
}

type PostCommentReportTarget = {
    type: typeof REPORT_TYPE.COMMENT,
    data: {
        _id : string,
        content : string,
        depth? : number,
    },
}

export type ReportAggregation = {
    _id: string,
    reporter: UserSummaryQuery,
    reason: ReportReasonCode,
    target: PostCommentReportTarget | UserReportTarget | PostReportTarget,
    status: ReportStatus,
    createdAt: Date
}