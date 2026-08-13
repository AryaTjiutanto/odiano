import { HashTagSearchDTO, UserSearchDTO } from "../search/search.type";

export type SearchHistoryTarget = UserSearchDTO | HashTagSearchDTO;

export type SearchHistoryDTO = {
    id : string,
    targetId : String | null | undefined,
    user : String,
    keyword : String | null,
    updatedAt : Date,
    target? : SearchHistoryTarget,
}