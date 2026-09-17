export const USER_FOLLOW_LIST_TYPE = {
    FOLLOWING: "following",
    FOLLOWERS: "followers",
} as const;

export type UserFollowListType = typeof USER_FOLLOW_LIST_TYPE[keyof typeof USER_FOLLOW_LIST_TYPE];