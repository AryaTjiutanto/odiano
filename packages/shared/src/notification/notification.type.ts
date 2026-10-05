import { AllowedMediaTypes, MediaAspectRatio } from "../post/index.js";
import { ReportReasonCode, ReportStatus } from "../report/index.js";
import { UserSummaryDTO } from "../user/index.js";
import { NOTIFICATION_TARGET_TYPE, NOTIFICATION_TYPE } from "./notification.const.js";

// notification target data
export type NotificationPostTarget = {
    type: typeof NOTIFICATION_TARGET_TYPE.POST,
    id: string,
    publicId: string,
    content?: string,
    firstMedia?: {
        type: AllowedMediaTypes,
        aspectRatio: MediaAspectRatio,
        url: string,
        publicId: string,
    },
    author?: UserSummaryDTO,
    createdAt: Date,
}

export type NotificationReportTarget = {
    type: typeof NOTIFICATION_TARGET_TYPE.REPORT,
    id: string,
    reason: ReportReasonCode,
    createdAt?: Date,
}

// notification data
export type NotificationCommentData = {
    type: typeof NOTIFICATION_TYPE.COMMENT,
    target: NotificationPostTarget,
    comment: {
        id: string,
        content: string,
        depth: number,
    },
};

export type NotificationLikeData = {
    type: typeof NOTIFICATION_TYPE.LIKE,
    target: NotificationPostTarget,
}

export type NotificationFollowData = {
    type: typeof NOTIFICATION_TYPE.FOLLOW,
}

export type NotificationSuspendData = {
    type: typeof NOTIFICATION_TYPE.SUSPEND,
    target: NotificationPostTarget | NotificationCommentData,
    report: NotificationReportTarget
}

export type NotificationReportData = {
    type: typeof NOTIFICATION_TYPE.REPORT,
    target: NotificationPostTarget | NotificationCommentData,
    report: NotificationReportTarget
    status : ReportStatus
}

export type NotificationData = NotificationCommentData | NotificationLikeData | NotificationFollowData | NotificationSuspendData | NotificationReportData;

// notification
export type Notification = {
    id: string,
    recepient: string,
    isRead: boolean,
    createdAt: Date,
    data: NotificationData,
}

// notification dto
export type NotificationDTO = Notification & {
    actor : UserSummaryDTO | null,
}