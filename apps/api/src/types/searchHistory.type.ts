import { SearchTypes } from "@connect/shared"
import { Types } from "mongoose"

export type SearchHistory = {
    targetId : Types.ObjectId,
    type : SearchTypes,
    user : Types.ObjectId,
    keyword : String, 
}

export type searchHistoryQuery = SearchHistory & {
    _id : Types.ObjectId,
    updatedAt : Date
}