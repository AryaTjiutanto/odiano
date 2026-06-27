export const NOTIFICATION_TYPE = {
    COMMENT_ON_YOUR_POST : "commentOnYourPost",
    COMMENT_ON_YOUR_COMMENT : "commentOnYourComment",
    LIKE_YOUR_POST : "likeYourPost",
    FOLLOW_YOU : "followYou",
} as const;

export const NOTIFICATION_TARGET_TYPE = {
    POST : "post",
    USER : "user"
} as const;

export const NOTIFICATION_READ_STATUS = {
    READ : "read",
    UNREAD : "unread",
}

export type NotificationType = typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE];
export type NotificationTargetType = typeof NOTIFICATION_TARGET_TYPE[keyof typeof NOTIFICATION_TARGET_TYPE];
export type NotificationReadStatus = typeof NOTIFICATION_READ_STATUS[keyof typeof NOTIFICATION_READ_STATUS];