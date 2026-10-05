import { SearchSuggestionDTO } from "../search/search.type.js";

export type SearchHistoryDTO = {
    id : string,
    targetId : string | null | undefined,
    user : string,
    keyword : string | null,
    updatedAt : Date,
    target? : SearchSuggestionDTO,
}