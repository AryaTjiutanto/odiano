import { UserProfileDTO, UserProfileImageDTO } from "@odiano/shared"
import { Types } from "mongoose"

export type ImageAsset = {
    url: string,
    publicId: string | null,
}

export type UserProfileQuery = {
    _id: Types.ObjectId,
} & Omit<UserProfileDTO, "isFollowing">

export type PostUserQuery = {
    _id: Types.ObjectId,
    name: string,
    username: string,
    profileImage: ImageAsset,
}

export type UserSummaryQuery = {
    _id: Types.ObjectId,
    name: string,
    username: string,
    profileImage: UserProfileImageDTO
}