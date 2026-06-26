export const NOTIFICATION_TYPE = {
    COMMENT_ON_YOUR_POST : "commentOnYourPost",
    COMMENT_ON_YOUR_COMMENT : "commentOnYourComment",
    LIKE_YOUR_POST : "likeYourPost",
} as const;

export const NOTIFICATION_TARGET_TYPE = {
    POST : "post",
    USER : "user"
} as const;

export type NotificationType = typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE];
export type NotificationTargetType = typeof NOTIFICATION_TARGET_TYPE[keyof typeof NOTIFICATION_TARGET_TYPE];