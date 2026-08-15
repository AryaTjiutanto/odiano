import {
    SEARCH_TYPES,
    type SearchSuggestionDTO,
} from "@odiano/shared";
import UserSearchResult from "./UserSearchSuggestion";
import GeneralSearchResult from "./GeneralSearchSuggestion";
import { Link } from "react-router-dom";
import HashTagSearchResult from "./HashtagSearchSuggestion";
import { useSearchInputContext } from "../../../providers/SearchInputProvider";

type Props = {
    data : SearchSuggestionDTO
};

const SearchSuggestion = ({ data }: Props) => {
    const { handleSearch, handleMutation } = useSearchInputContext();

    // display data
    if (data.type === SEARCH_TYPES.GENERAL && data.keyword) {
        return (
            <Link to={`/search?${new URLSearchParams({
                q: data.keyword,
            }).toString()}`} onClick={() => handleSearch(data.keyword || "", () => handleMutation({
                type: SEARCH_TYPES.GENERAL,
                data: null,
                keyword: data.keyword,
            }))}>
                <GeneralSearchResult value={data.keyword}/>
            </Link>
        );
    }

    if (data.type === SEARCH_TYPES.USER && data.data) {
        return (
            <Link to={`/profile/${data.data.username}`} onClick={() => handleSearch(data.data?.name || "", () => handleMutation({
                type: SEARCH_TYPES.USER,
                data: data.data,
                keyword: null,
            }))}>
                <UserSearchResult
                    user={data.data}
                />
            </Link>
        );
    }


    if (data.type === SEARCH_TYPES.HASHTAG && data.data) {
        const searchParams = new URLSearchParams({
            q: `#${data.data.name}`
        });
        return (
            <Link to={`/search?${searchParams.toString()}`} onClick={() => handleSearch("#" + data.data?.name, () => handleMutation({
                type: SEARCH_TYPES.HASHTAG,
                data: data.data,
                keyword: null,
            }))}>
                <HashTagSearchResult
                    hashtag={data.data}
                />
            </Link>
        );
    }

    return null;
};

export default SearchSuggestion;