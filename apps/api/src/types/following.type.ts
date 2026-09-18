import { Types } from "mongoose"
import { UserSummaryQuery } from "./user.type"

export type UserFollowListQuery = {
    _id : Types.ObjectId,
    user : UserSummaryQuery,
    following : {_id : string}[]
}