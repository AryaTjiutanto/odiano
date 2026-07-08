import { SEARCH_TYPES, type SearchHistoryDTO } from "@connect/shared"
import SearchResult from "./searchResult/SearchResult"

type Props = {
    data : SearchHistoryDTO,
}

const SearchHistory = ({data} : Props) => {
    if(data.type == SEARCH_TYPES.USER && data.targetData) {
        return (
            <SearchResult data={{ type : "user", data : data.targetData }}/>
        )
    }
}

export default SearchHistory;