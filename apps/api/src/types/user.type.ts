import { UserProfileImageDTO } from "@connect/shared"

export type UserProfileQuery = {
    username : string,
    name : string,
    bio : string,
    profileImage : UserProfileImageDTO,
    createdAt : Date,
}