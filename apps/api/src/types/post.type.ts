import { PostMedia, PostVisibilities } from "@odiano/shared"
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
    createdAt : Date,
    updatedAt : Date,
    commentCount : number,
    likeCount : number,
    author? : UserSummaryQuery,
}