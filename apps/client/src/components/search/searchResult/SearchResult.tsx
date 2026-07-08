import { useMutation } from "@tanstack/react-query";
import {
    SEARCH_TYPES,
    type SearchHistoryDTO,
    type SearchTypes,
    type UserSummaryDTO,
} from "@connect/shared";
import UserSearchResult from "./UserSearchResult";
import { searchKeys } from "../../../queries/searchKeys";
import { recordSearchHistory } from "../../../services/searchHistory.service";
import { Link } from "react-router-dom";
import useSetQueryDataHandler from "../../../hooks/useSetQueryDataHandler";
import { useAppSelector } from "../../../hooks/useRedux";

type UserTypeProps = {
    type: "user";
    data: UserSummaryDTO;
};

type Props = {
    data: UserTypeProps;
};

const SearchResult = ({ data }: Props) => {
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

        onSuccess : () => setQueryDataHandler<SearchHistoryDTO[]>(searchKeys.history, (oldData) => {
            if(!currentUserId) return;

            const newData = {
                targetId : data.data.id,
                type : SEARCH_TYPES.USER,
                user : currentUserId,
                targetData : data.data,
                keyword : "",
                updatedAt : new Date(),
            } as SearchHistoryDTO

            return [
                newData,
                ...(oldData.filter((old) => old.targetId !== data.data.id))
            ];
        }),
    });

    // display data
    if (data.type === "user") {
        return (
            <Link to={`/profile/${data.data.username}`} onClick={() =>
                historyMutation.mutate({
                    targetId: data.data.id,
                    type: SEARCH_TYPES.USER,
                })
            }>
                <UserSearchResult
                    user={data.data}
                />
            </Link>
        );
    }

    return null;
};

export default SearchResult;