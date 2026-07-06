import { SEARCH_HISTORY_TYPES, SearchHistoryTypes } from "@connect/shared";
import { model, Schema, Types } from "mongoose";

type SearchHistory = {
    targetId : Types.ObjectId,
    type : SearchHistoryTypes,
    user : Types.ObjectId,
    keyword : String, 
}

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
    },
    keyword : {
        type : String,
    }
})

searchHistorySchema.index({
    user : 1
})

const SearchHistory = model("SearchHistorySchema", searchHistorySchema);

export default SearchHistory;