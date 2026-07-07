import { UserSummaryDTO } from "../user"
import { SearchHistoryTypes } from "./searchHistory.const"

export type searchHistoryDTO = {
    targetData ? : UserSummaryDTO,
    targetId : String | null | undefined,
    type : SearchHistoryTypes,
    user : String,
    keyword : String | null,
}