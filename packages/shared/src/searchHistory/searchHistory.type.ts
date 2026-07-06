import { UserSummaryDTO } from "../user"
import { SearchHistoryTypes } from "./searchHistory.const"

export type searchHistoryDTO = {
    targetId : String | UserSummaryDTO | null | undefined,
    type : SearchHistoryTypes,
    user : String,
    keyword : String | null,
}