import {
    SEARCH_TYPES,
    type HashTagSearchDTO,
    type UserSearchDTO,
} from "@odiano/shared";
import UserSearchResult from "./UserSearchResult";
import { Link } from "react-router-dom";
import HashTagSearchResult from "./HashtagSearchResult";
import { useSearchInputContext } from "../../../providers/SearchInputProvider";

type Props = {
    data : UserSearchDTO | HashTagSearchDTO,
};

const SearchResult = ({ data }: Props) => {
    const { handleSearch, handleMutation } = useSearchInputContext();

    // display data
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

export default SearchResult;