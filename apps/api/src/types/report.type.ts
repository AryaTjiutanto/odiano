import { PostMedia, REPORT_TYPE, ReportReasonCode, ReportStatus } from "@odiano/shared";
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
        _id: string,
        username: string,
        profileImage: ImageAsset,
        name : string,
    },
}

type PostCommentReportTarget = {
    type: typeof REPORT_TYPE.COMMENT,
    data: {
        _id: string,
        content: string,
        depth?: number,
    },
}

export type ReportAggregationData = {
    _id: string,
    reporter: UserSummaryQuery,
    reason: ReportReasonCode,
    target: PostCommentReportTarget | UserReportTarget | PostReportTarget,
    status: ReportStatus,
    createdAt: Date
}

export type ReportAggregationQueryResult = {
    metadata?: {
        total: number,
    }[],
    data: ReportAggregationData[]
}