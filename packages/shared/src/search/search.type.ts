import { HashTagSummaryDTO } from "../hashtag/index.js"
import { UserSummaryDTO } from "../user/index.js"
import { SEARCH_TYPES } from "./search.const.js";


export type SearchDTO = {
    keyword : string | null,
}

export type UserSearchDTO = SearchDTO & {
    type : typeof SEARCH_TYPES.USER,
    data : UserSummaryDTO | null,
}

export type HashTagSearchDTO = SearchDTO & {
    type : typeof SEARCH_TYPES.HASHTAG,
    data : HashTagSummaryDTO | null,
}

export type GeneralSearchDTO = SearchDTO & {
    type : typeof SEARCH_TYPES.GENERAL,
    data : null,
}

export type SearchSuggestionDTO = UserSearchDTO | HashTagSearchDTO | GeneralSearchDTO;