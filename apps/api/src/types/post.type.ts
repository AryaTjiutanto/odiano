import { PostMedia, PostVisibilities } from "@connect/shared"
import { Types } from "mongoose"
import { UserSummaryQuery } from "./user.type"

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
    author? : UserSummaryQuery,
}