export const POST_COMMENT_STATUS = {
    ACTIVE : "active",
    SUSPENDED : "suspended",
} as const;

export const POST_COMMENT_CONTENT_LENGTH = {
    MIN : 1,
    MAX : 400,
} as const;

export const POST_COMMENT_DEPTH = {
    MIN : 0,
    MAX : 1,
} as const;

export type PostCommentStatus = typeof POST_COMMENT_STATUS[keyof typeof POST_COMMENT_STATUS];