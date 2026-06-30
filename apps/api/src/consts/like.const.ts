export const LIKE_TYPES = {
    POST : "post",
    COMMENT : "comment",
} as const;

export type LikeTypes = typeof LIKE_TYPES[keyof typeof LIKE_TYPES];