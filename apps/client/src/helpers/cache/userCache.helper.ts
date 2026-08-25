import type { UserProfileDTO, UserSummaryDTO } from "@odiano/shared";

export function updateUserTotalPosts(oldData: UserProfileDTO, by: number, mode: "increase" | "decrease" = "increase") {
    return {
        ...oldData,
        totalPosts: oldData.totalPosts + (mode == "increase" ? by : -by)
    }
}

export function markUserAsFollowedInList(oldData: UserSummaryDTO[], userId: string | undefined) {
    return oldData.map((data) => {
        if (data.id == userId) {
            return {
                ...data,
                isFollowing: true,
            }
        }

        return data
    })
}

export function markUserAsUnfollowedInList(oldData: UserSummaryDTO[], userId: string | undefined) {
    return oldData.map((data) => {
        if (data.id == userId) {
            return {
                ...data,
                isFollowing: false,
            }
        }

        return data;
    })
}

export function markProfileAsFollowed(oldData: UserProfileDTO) {
    return {
        ...oldData,
        followerCount: oldData.followerCount + 1,
        isFollowing: true,
    }
}

export function markProfileAsUnfollowed(oldData: UserProfileDTO) {
    return {
        ...oldData,
        followerCount: oldData.followerCount - 1,
        isFollowing: false,
    }
}