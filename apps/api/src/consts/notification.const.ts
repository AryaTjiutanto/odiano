export const NOTIFICATION_TYPE = {
    COMMENT : "comment",
    POST : "post",
    FOLLOW : "follow",
} as const

export const NOTIFICATION_TARGET_TYPE = {
    POST : "post",
    FOLLOW : "follow"
}

export type NotificationType = typeof NOTIFICATION_TYPE[keyof typeof NOTIFICATION_TYPE];
export type NotificationTargetType = typeof NOTIFICATION_TARGET_TYPE[keyof typeof NOTIFICATION_TARGET_TYPE];