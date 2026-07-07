import { SEARCH_HISTORY_TYPES, type searchHistoryDTO } from "@connect/shared"
import UserSearchResult from "./searchResult/UserSearchResult"

type Props = {
    data : searchHistoryDTO,
}

const SearchHistory = ({data} : Props) => {
    if(data.type == SEARCH_HISTORY_TYPES.USER && data.targetData) {
        return (
            <UserSearchResult user={data.targetData}/>
        )
    }
}

export default SearchHistory;