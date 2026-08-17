import type { UserProfileDTO } from "@odiano/shared";

export function updateUserTotalPosts (oldData: UserProfileDTO, by: number, mode : "increase" | "decrease" = "increase") {
    return {
        ...oldData,
        totalPosts: oldData.totalPosts + (mode == "increase" ? by : -by)
    }
}