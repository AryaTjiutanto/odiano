import { SEARCH_HISTORY_TYPES, searchHistoryDTO, SearchHistoryTypes } from "@connect/shared";
import { SEARCH_HISTORY_LIMIT } from "../consts/searchHistory.const"
import SearchHistory from "../models/searchHistory.model"
import { User } from "../models/user.model";
import { UserSummaryQuery } from "../types/user.type";
import { searchHistoryQuery } from "../types/searchHistory.type";
import { toUserSummaryDTO } from "../mappers/user.mapper";
import { toSearchHistoryDTO } from "../mappers/searchHistory.mapper";

export const getSearchHistory = async () : Promise<searchHistoryDTO[]> => {
    const searchHistories = await SearchHistory.find()
    .limit(SEARCH_HISTORY_LIMIT)
    .lean<searchHistoryQuery[]>();

    // get user summary
    const userHistories = searchHistories.filter((search) => search.type == SEARCH_HISTORY_TYPES.USER);
    const userIds = userHistories.map(h => h.targetId);
    const userSummaries = await User.find({ _id : {$in : userIds} })
    .select("_id name username profileImage")
    .lean<UserSummaryQuery[]>();
    
    const usersMap = new Map(userSummaries.map((user) => [user._id.toString(), toUserSummaryDTO(user)]));
    
    // organize data
    const searchHistoriesDTO = searchHistories.map((history) => toSearchHistoryDTO(history, usersMap));

    return searchHistoriesDTO
}

export const recordHistory = async (currentUserId : string, type : SearchHistoryTypes, targetId : string, keyword? : String | undefined | null) => {
    const record = await SearchHistory.findOne({
        user : currentUserId,
        $or : [
            {targetId},
            {keyword},
        ]
    }).select("_id updatedAt");

    // create searchHistory
    if(!record) {
        await SearchHistory.create({
            targetId,
            type,
            user : currentUserId,
            ...(keyword && {keyword})
        })

        // delete old searchHistory
        const idsToDelete = await SearchHistory.find({user : currentUserId})
            .sort({updatedAt : -1})
            .skip(SEARCH_HISTORY_LIMIT)
            .distinct("_id");
    
        if(idsToDelete.length > 0) {
            await SearchHistory.deleteMany({
                _id : {$in : idsToDelete}
            })
        }

        return;
    }

    // update 
    record.save();
}