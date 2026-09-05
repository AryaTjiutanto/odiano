import { PostMedia, REPORT_TYPE, ReportReasonCode, ReportStatus, ReportType } from "@odiano/shared";
import { ImageAsset, UserSummaryQuery } from "./user.type";
import { Types } from "mongoose";

// report schema
export type ReportSchema = {
    reason: ReportReasonCode,
    status: ReportStatus,
    reporter: Types.ObjectId,
    target: PostReportTargetSchema | UserReportTargetSchema | PostCommentReportTargetSchema,
}

export type PostReportTargetSchema = {
    type : typeof REPORT_TYPE.POST,
    id : Types.ObjectId,
    snapshot : {
        publicId: string,
        content: string,
        Media: PostMedia[],
        hashTags : string[],
        author : Types.ObjectId,
    }
}

export type UserReportTargetSchema = {
    type : typeof REPORT_TYPE.USER,
    id : Types.ObjectId,
    snapshot : {
        username: string,
        profileImage: ImageAsset,
        name : string,
        email : string
    }
}

export type PostCommentReportTargetSchema = {
    type : typeof REPORT_TYPE.COMMENT,
    id : Types.ObjectId,
    snapshot : {
        author : Types.ObjectId,
        parentId : Types.ObjectId,
        content: string,
        depth?: number,
    }
}

// query
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