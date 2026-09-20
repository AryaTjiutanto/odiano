import type { InfiniteQuery, UserSummaryDTO } from "@odiano/shared";
import type { InfiniteData } from "@tanstack/react-query";

export const USER_FOLLOW_LIST_TYPE = {
    FOLLOWING: "following",
    FOLLOWERS: "followers",
} as const;

export type UserFollowListType = typeof USER_FOLLOW_LIST_TYPE[keyof typeof USER_FOLLOW_LIST_TYPE];
export type InfiniteQueryUserSummaryDTO = InfiniteData<InfiniteQuery<UserSummaryDTO[]>>;