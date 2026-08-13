import { useMutation } from "@tanstack/react-query";
import {
    SEARCH_TYPES,
    type HashTagSearchDTO,
    type SearchHistoryDTO,
    type SearchTypes,
    type UserSearchDTO,
} from "@odiano/shared";
import UserSearchResult from "./UserSearchResult";
import { searchKeys } from "../../../queries/searchKeys";
import { recordSearchHistory } from "../../../services/searchHistory.service";
import { Link } from "react-router-dom";
import useSetQueryDataHandler from "../../../hooks/useSetQueryDataHandler";
import { useAppSelector } from "../../../hooks/useRedux";
import HashTagSearchResult from "./HashtagSearchResult";

type Props = {
    data : UserSearchDTO | HashTagSearchDTO,
};

const SearchResult = ({ data }: Props) => {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const currentUserId = useAppSelector((state) => state.auth.user?.id);

    // handle mutation
    const setQueryDataHandler = useSetQueryDataHandler();

    const historyMutation = useMutation({
        mutationKey: searchKeys.history,
        mutationFn: ({
            targetId,
            type,
            keyword,
        }: {
            targetId: string;
            type: SearchTypes;
            keyword?: string;
        }) => recordSearchHistory(targetId, type, keyword),

        onSuccess: (response) => setQueryDataHandler<SearchHistoryDTO[]>(searchKeys.history, (oldData) => {
            if (!currentUserId) return;

            const newData = {
                id : response.data?.id,
                targetId: data.data?.id,
                user: currentUserId,
                keyword: "",
                updatedAt: new Date(),
                target : data,
            } as SearchHistoryDTO

            return [
                newData,
                ...(oldData.filter((old) => old.targetId !== data.data?.id))
            ];
        }),
    });

    // handleMutation 
    const handleMutation = async (type : SearchTypes) => {
        if(!isAuthenticated) return;

        await historyMutation.mutateAsync({
            targetId: data.data?.id || "",
            type,
        });
    }

    // display data
    if (data.type === SEARCH_TYPES.USER && data.data) {
        return (
            <Link to={`/profile/${data.data.username}`} onClick={() => handleMutation(SEARCH_TYPES.USER)}>
                <UserSearchResult
                    user={data.data}
                />
            </Link>
        );
    }


    if (data.type === SEARCH_TYPES.HASHTAG && data.data) {
        return (
            <Link to={`/hashtag/${data.data.name}`} onClick={() => handleMutation(SEARCH_TYPES.HASHTAG)}>
                <HashTagSearchResult
                    hashtag={data.data}
                />
            </Link>
        );
    }

    return null;
};

export default SearchResult;