import { UserProfileDTO } from "@connect/shared";
import { UserProfileQuery } from "../types/user.type";

export const toUserProfileDTO = (data : UserProfileQuery) : UserProfileDTO => {
    return {
        id: data._id.toString(),
        name : data.name,
        username : data.username ?? "",
        bio : data.bio,
        profileImage : data.profileImage,
        createdAt : data.createdAt,
    }
}