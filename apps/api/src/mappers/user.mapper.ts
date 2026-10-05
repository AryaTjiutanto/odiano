import { UserProfileDTO, UserSummaryDTO } from "@odiano/shared";
import { UserProfileQuery, UserSummaryQuery } from "../types/user.type.js";

export const toUserProfileDTO = (data : UserProfileQuery, isFollowing? : boolean | null | undefined) : UserProfileDTO => {
    return {
        id: data._id.toString(),
        name : data.name,
        username : data.username ?? "",
        bio : data.bio,
        profileImage : data.profileImage,
        coverImage : data.coverImage,
        createdAt : data.createdAt,
        followerCount : data.followerCount,
        followingCount : data.followingCount,
        totalPosts : data.totalPosts,
        ...(isFollowing ? {isFollowing} : {}),
    }
}

export const toUserSummaryDTO = (data : UserSummaryQuery, isFollowing? : boolean | null | undefined) : UserSummaryDTO => {
    return {
        id : data._id.toString(),
        name : data.name,
        username : data.username,
        profileImage : data.profileImage,
        ...(data.bio && {bio : data.bio}),
        ...(isFollowing && {isFollowing}),
    }
}