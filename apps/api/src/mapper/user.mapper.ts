import { UserProfileDTO } from "@connect/shared";
import { UserProfileQuery } from "../types/user.type";

export const toUserProfileDTO = (data : UserProfileQuery, isFollowing? : boolean | null | undefined) : UserProfileDTO => {
    return {
        id: data._id.toString(),
        name : data.name,
        username : data.username ?? "",
        bio : data.bio,
        profileImage : data.profileImage,
        createdAt : data.createdAt,
        followerCount : data.followerCount,
        followingCount : data.followingCount,
        ...(isFollowing ? {isFollowing} : {}),
    }
}