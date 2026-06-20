import { Types } from "mongoose"
import { UserSummaryQuery } from "./user.type"

export type PostCommentQuery = {
    _id : Types.ObjectId,
    parentId : Types.ObjectId,
    content : string,
    depth : number,
    replyCount : number,
    author : UserSummaryQuery,
    createdAt : Date,
}