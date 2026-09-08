import { AllowedMediaTypes, MediaAspectRatio } from "../post";
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
    }
}

export type NotificationTargetCommentData = {
    post : NotificationTargetPostData,
    comment : {
        id: string,
        content: string,
        depth: number,
    }
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
    description : string,
    report : {
        id : string,
        code : ReportReasonCode
    }
}

export type NotificationData = CommentOnYourPostData | LikeYourPostData | FollowYouData | YourPostSuspendedData

// notification
export type NotificationDTO = {
    id : string,
    recepient : string,
    isRead : boolean,
    data : NotificationData,
    createdAt : Date,
}