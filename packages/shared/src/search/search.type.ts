import { HashTagSummaryDTO } from "../hashtag"
import { UserSummaryDTO } from "../user"
import { SEARCH_TYPES } from "./search.const";


export type UserSearchDTO = {
    type : typeof SEARCH_TYPES.USER,
    data : UserSummaryDTO | null,
}

export type HashTagSearchDTO = {
    type : typeof SEARCH_TYPES.HASHTAG,
    data : HashTagSummaryDTO | null,
}

// export type TopicSearchSuggestionDTO = {
//     type : typeof SEARCH_TYPES.TOPIC,
//     data : TopicSummaryDTO,
// }

export type SearchSuggestionDTO = UserSearchDTO | HashTagSearchDTO;