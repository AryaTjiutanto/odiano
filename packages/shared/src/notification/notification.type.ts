import { AllowedMediaTypes, MediaAspectRatio, PostDTO } from "../post";
import { ReportReasonCode } from "../report";
import { UserSummaryDTO } from "../user";
import { NOTIFICATION_TYPE } from "./notification.const";

// notification target data
export type NotificationTargetPostData = {
    id: string,
    publicId: string,
    content?: string,
    firstMedia?: {
        type : AllowedMediaTypes,
        aspectRatio: MediaAspectRatio,
        url: string,
        publicId: string,
    },
    author? : UserSummaryDTO,
    createdAt : Date,
}

export type NotificationTargetCommentData = {
    post : NotificationTargetPostData,
    comment : {
        id: string,
        content: string,
        depth: number,
    }
}

export type NotificationTargetReportData = {
    id : string,
    code : ReportReasonCode,
    createdAt? : Date,
}

// notification data
export type CommentOnYourPostData = {
    type : typeof NOTIFICATION_TYPE.COMMENT_ON_YOUR_POST,
    target : NotificationTargetCommentData,
    actor : UserSummaryDTO,
}

export type LikeYourPostData = {
    type : typeof NOTIFICATION_TYPE.LIKE_YOUR_POST,
    target : NotificationTargetPostData,
    actor : UserSummaryDTO,
}

export type FollowYouData = {
    type : typeof NOTIFICATION_TYPE.FOLLOW_YOU,
    actor : UserSummaryDTO,
}

export type YourPostSuspendedData = {
    type : typeof NOTIFICATION_TYPE.YOUR_POST_SUSPENDED,
    target : NotificationTargetPostData,
    report : NotificationTargetReportData
}

export type YourReportResolvedData = {
    type : typeof NOTIFICATION_TYPE.YOUR_REPORT_RESOLVED,
    target : NotificationTargetPostData,    
    report : NotificationTargetReportData
}

export type NotificationData = CommentOnYourPostData | LikeYourPostData | FollowYouData | YourPostSuspendedData | YourReportResolvedData

// notification
export type NotificationDTO = {
    id : string,
    recepient : string,
    isRead : boolean,
    data : NotificationData,
    createdAt : Date,
}