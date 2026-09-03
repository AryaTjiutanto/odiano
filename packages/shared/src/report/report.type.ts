import { PostMedia } from "../post";
import { UserProfileImageDTO, UserSummaryDTO } from "../user";
import { ReportReasonCode } from "./reportReason.const";
import { ReportStatus } from "./reportStatus.const";
import { REPORT_TYPE } from "./reportType.const";

export type ReportPostTarget = {
    type : typeof REPORT_TYPE.POST,
    data : {
        id : string,
        publicId : string,
        content : string | null,
        firstMedia : PostMedia | null,
    },
}

export type ReportUserTarget = {
    type : typeof REPORT_TYPE.USER,
    data : {
        id : string,
        username : string,
        profileImage : UserProfileImageDTO,
        name : string,
    },
}

export type PostCommentReportTarget = {
    type : typeof REPORT_TYPE.COMMENT,
    data : {
        id : string,
        content : string,
        depth? : number,
    },
}

export type ReportDTO = {
    id : string,
    reporter : UserSummaryDTO,
    reason : ReportReasonCode,
    target : ReportPostTarget | ReportUserTarget | PostCommentReportTarget,
    status : ReportStatus,
    createdAt : Date,
}