import { SEARCH_TYPES, SearchHistoryDTO, SearchTypes } from "@odiano/shared";
import { SEARCH_HISTORY_LIMIT } from "../consts/searchHistory.const"
import { User } from "../models/user.model";
import { UserSummaryQuery } from "../types/user.type";
import { searchHistoryQuery } from "../types/searchHistory.type";
import { toUserSummaryDTO } from "../mappers/user.mapper";
import { toSearchHistoryDTO } from "../mappers/searchHistory.mapper";
import { SearchHistory } from "../models/searchHistory.model";
import mongoose from "mongoose";

export const getSearchHistory = async (currentUserId : string) : Promise<SearchHistoryDTO[]> => {
    const searchHistories = await SearchHistory.find({user : currentUserId})
    .sort({updatedAt : -1})
    .limit(SEARCH_HISTORY_LIMIT)
    .lean<searchHistoryQuery[]>();

    // get user summary
    const userHistories = searchHistories.filter((search) => search.type == SEARCH_TYPES.USER);
    const userIds = userHistories.map(h => h.targetId);
    const userSummaries = await User.find({ _id : mongoose.trusted({
        $in : userIds
    }) })
    .select("_id name username profileImage updatedAt")
    .lean<UserSummaryQuery[]>();
    
    const usersMap = new Map(userSummaries.map((user) => [user._id.toString(), toUserSummaryDTO(user)]));
    
    // organize data
    const searchHistoriesDTO = searchHistories.map((history) => toSearchHistoryDTO(history, usersMap));

    return searchHistoriesDTO
}

export const recordHistory = async (currentUserId : string, type : SearchTypes, targetId : string, keyword? : String | undefined | null) => {
    const record = await SearchHistory.findOne({
        user : currentUserId,
        $or : [
            {targetId},
            ...(keyword ? [{keyword}] : []),
        ]
    }).select("_id updatedAt");

    
    // create searchHistory
    if(!record) {
        const searchHistory = await SearchHistory.create({
            targetId,
            type,
            user : currentUserId,
            ...(keyword && {keyword})
        })

        // delete old searchHistory
        const historiesToDelete = await SearchHistory.find({user : currentUserId})
        .sort({updatedAt : -1})
        .skip(SEARCH_HISTORY_LIMIT)
        .select("_id")
        .lean();

        const idsToDelete = historiesToDelete.map((h) => h._id.toString());

        if(idsToDelete.length > 0) {
            await SearchHistory.deleteMany({
                _id : {$in : idsToDelete}
            })
        }
        
        return searchHistory._id.toString();
    }

    // update 
    record.save();

    return record._id.toString();
}

export const deleteHistory = async (currentUserId : string, historyId : string) => {
    await SearchHistory.deleteOne({_id : historyId, user : currentUserId});
}

export const deleteAllHistory = async (currentUserId : string) => {
    await SearchHistory.deleteMany({user : currentUserId});
}