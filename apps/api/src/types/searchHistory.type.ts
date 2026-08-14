import { SearchTypes } from "@odiano/shared"
import { Types } from "mongoose"

export type SearchHistory = {
    targetId? : Types.ObjectId | null,
    type : SearchTypes,
    user : Types.ObjectId,
    keyword : String | null, 
}

export type searchHistoryQuery = SearchHistory & {
    _id : Types.ObjectId,
    updatedAt : Date
}