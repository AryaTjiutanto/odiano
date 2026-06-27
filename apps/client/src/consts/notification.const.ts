export const NOTIFICATION_KEY = {
    READ: ['notification', 'read'],
    UNREAD: ['notification', 'unread'],
};

export type NotificationKey = typeof NOTIFICATION_KEY[keyof typeof NOTIFICATION_KEY];