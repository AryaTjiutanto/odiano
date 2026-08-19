import { MediaAspectRatio } from "../post";
import { UserSummaryDTO } from "../user";
import { NotificationTargetType, NotificationType } from "./notification.const";

export type NotificationDTO = {
    id: string,
    actor: UserSummaryDTO,
    recepient: string,
    targetId: String,
    targetType: NotificationTargetType,
    type: NotificationType,
    isRead: boolean,
    createdAt: Date,

    data?: NotificationData,
}

export type NotificationPostData = {
    id: string,
    publicId: string,
    content?: string,
    firstMedia?: {
        aspectRatio: MediaAspectRatio,
        url: string,
        publicId: string,
    }
}

export type NotificationCommentData = {
    id: string,
    message: string,
}

export type NotificationData = {
    comment?: NotificationCommentData,
    post?: NotificationPostData,
}