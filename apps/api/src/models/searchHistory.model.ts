import { SEARCH_HISTORY_TYPES } from "@connect/shared";
import { model, Schema, Types } from "mongoose";
import { SearchHistory } from "../types/searchHistory.type";

const searchHistorySchema = new Schema<SearchHistory>({
    targetId : {
        type : Types.ObjectId,
        required : true,
    },
    type : {
        type : String,
        enum : Object.values(SEARCH_HISTORY_TYPES),
        required : true,
    },
    user : {
        type : Types.ObjectId,
        required : true,
        ref : "User",
    },
    keyword : {
        type : String,
    }
}, {timestamps : true})

searchHistorySchema.index({
    user : 1
})

const SearchHistory = model("SearchHistorySchema", searchHistorySchema);

export default SearchHistory;