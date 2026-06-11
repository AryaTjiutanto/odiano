import { UserProfileImageDTO } from "@connect/shared"
import { Types } from "mongoose"

export type UserProfileImageSchema = {
    url: string,
    publicId: string,
}

export type UserProfileQuery = {
    _id : Types.ObjectId,
    username : string,
    name : string,
    bio : string,
    profileImage : UserProfileImageDTO,
    createdAt : Date,
}

export type PostUserQuery = {
    _id : Types.ObjectId,
    name : string,
    username : string,
    profileImage : UserProfileImageSchema,
}