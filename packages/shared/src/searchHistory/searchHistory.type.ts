import { SearchTypes } from "../search/search.const"
import { UserSummaryDTO } from "../user"

export type SearchHistoryDTO = {
    targetData ? : UserSummaryDTO,
    targetId : String | null | undefined,
    type : SearchTypes,
    user : String,
    keyword : String | null,
    updatedAt : Date,
}