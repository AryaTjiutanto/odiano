import { PostMedia } from "../post";
import { UserProfileImageDTO, UserSummaryDTO } from "../user";
import { ReportReasonCode } from "./reportReason.const";
import { ReportStatus } from "./reportStatus.const";
import { REPORT_TYPE } from "./reportType.const";

export type ReportPostTarget = {
    type: typeof REPORT_TYPE.POST,
    id: string,
    exists : boolean,
    snapshot: {
        publicId: string,
        content: string | null,
        media: PostMedia[] | null,
        hashTags: string[] | null,
        author: string,
    },
}

export type ReportUserTarget = {
    type: typeof REPORT_TYPE.USER,
    id: string,
    exists : boolean,
    snapshot: {
        username: string,
        profileImage: UserProfileImageDTO | null,
        name: string | null,
        email: string
    }
}

export type PostCommentReportTarget = {
    type: typeof REPORT_TYPE.COMMENT,
    id : string,
    exists : boolean,
    snapshot: {
        author : string,
        parentId : string | null,
        content: string,
        depth?: number,
    },
}

export type ReportDTO = {
    id: string,
    reporter: UserSummaryDTO,
    reason: ReportReasonCode,
    target: ReportPostTarget | ReportUserTarget | PostCommentReportTarget,
    status: ReportStatus,
    createdAt: Date,
}