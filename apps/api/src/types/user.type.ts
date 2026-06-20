import { UserProfileDTO, UserProfileImageDTO } from "@connect/shared"
import { Types } from "mongoose"

export type UserProfileImageSchema = {
    url: string,
    publicId: string,
}

export type UserProfileQuery = {
    _id: Types.ObjectId,
} & Omit<UserProfileDTO, "isFollowing">

export type PostUserQuery = {
    _id: Types.ObjectId,
    name: string,
    username: string,
    profileImage: UserProfileImageSchema,
}

export type UserSummaryQuery = {
    _id: Types.ObjectId,
    name: string,
    username: string,
    profileImage: UserProfileImageDTO
}