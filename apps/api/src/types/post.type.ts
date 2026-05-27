import { PostMedia, PostVisibilities, UserProfileImageDTO } from "@connect/shared"
import { Types } from "mongoose"

export type PostQuery = {
    _id : Types.ObjectId,
    publicId : string,
    content : string,
    media : PostMedia[] | null,
    visibility : PostVisibilities,
    hideLikeAndViewCount : boolean,
    turnOffCommenting : boolean,
    isArchive : boolean,
    createdAt : Date,
    updatedAt : Date,
    author : {
        _id : Types.ObjectId,
        name : string,
        username : string,
        slug : string,
        profileImage : UserProfileImageDTO 
    } | null,
}