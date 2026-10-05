import { PostMedia } from "../post/index.js";
import { UserProfileImageDTO, UserSummaryDTO } from "../user/index.js";
import { ReportReasonCode } from "./reportReason.const.js";
import { ReportStatus } from "./reportStatus.const.js";
import { REPORT_TYPE } from "./reportType.const.js";

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
        postId : string,
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