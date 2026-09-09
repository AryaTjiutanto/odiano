import { PostMedia, REPORT_TYPE, ReportReasonCode, ReportStatus, ReportType } from "@odiano/shared";
import { ImageAsset, UserSummaryQuery } from "./user.type";
import { Types } from "mongoose";

// report schema
export type ReportSchema = {
    reason: ReportReasonCode,
    status: ReportStatus,
    reporter: Types.ObjectId,
    target: PostReportTargetSchema | UserReportTargetSchema | PostCommentReportTargetSchema,
    createdAt : Date,
}

export type PostReportTargetSchema = {
    type : typeof REPORT_TYPE.POST,
    id : Types.ObjectId,
    snapshot : {
        publicId: string,
        content: string,
        media: PostMedia[] | null,
        hashTags : string[] | null,
        author : Types.ObjectId,
    }
}

export type UserReportTargetSchema = {
    type : typeof REPORT_TYPE.USER,
    id : Types.ObjectId,
    snapshot : {
        username: string,
        profileImage: ImageAsset | null,
        name : string | null,
        email : string
    }
}

export type PostCommentReportTargetSchema = {
    type : typeof REPORT_TYPE.COMMENT,
    id : Types.ObjectId,
    snapshot : {
        author : Types.ObjectId,
        parentId : Types.ObjectId | null,
        content: string,
        depth?: number,
    }
}

// query
type PostReportTarget = PostReportTargetSchema & {
    isExists : boolean
}

type UserReportTarget = UserReportTargetSchema & {
    isExists : boolean
}

type PostCommentReportTarget = PostCommentReportTargetSchema & {
    isExists : boolean
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