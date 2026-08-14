import { SEARCH_TYPES } from "@odiano/shared";
import { model, Schema, Types } from "mongoose";
import { SearchHistory as SearchHistorySchema } from "../types/searchHistory.type";

const searchHistorySchema = new Schema<SearchHistorySchema>({
    targetId : {
        type : Types.ObjectId,
        required : false,
        default : null,
    },
    type : {
        type : String,
        enum : Object.values(SEARCH_TYPES),
        required : true,
    },
    user : {
        type : Types.ObjectId,
        required : true,
        ref : "User",
    },
    keyword : {
        type : String,
        required : false,
        default : null,
    }
}, {timestamps : true})

searchHistorySchema.index({
    user : 1
})

export const SearchHistory = model("SearchHistory", searchHistorySchema);