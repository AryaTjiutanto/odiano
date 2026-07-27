import { useMutation } from "@tanstack/react-query";
import {
    SEARCH_TYPES,
    type SearchHistoryDTO,
    type SearchTypes,
    type UserSummaryDTO,
} from "@odiano/shared";
import UserSearchResult from "./UserSearchResult";
import { searchKeys } from "../../../queries/searchKeys";
import { recordSearchHistory } from "../../../services/searchHistory.service";
import { Link } from "react-router-dom";
import useSetQueryDataHandler from "../../../hooks/useSetQueryDataHandler";
import { useAppSelector } from "../../../hooks/useRedux";

type Props = {
    type: SearchTypes,
    data: UserSummaryDTO,
};

const SearchResult = ({ type,data }: Props) => {
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
                targetId: data.id,
                type: SEARCH_TYPES.USER,
                user: currentUserId,
                targetData: data,
                keyword: "",
                updatedAt: new Date(),
            } as SearchHistoryDTO

            return [
                newData,
                ...(oldData.filter((old) => old.targetId !== data.id))
            ];
        }),
    });

    // handleMutation 
    const handleMutation = async (type : SearchTypes) => {
        if(!isAuthenticated) return;

        await historyMutation.mutateAsync({
            targetId: data.id,
            type,
        });
    }

    // display data
    if (type === "user") {
        return (
            <Link to={`/profile/${data.username}`} onClick={() => handleMutation(SEARCH_TYPES.USER)}>
                <UserSearchResult
                    user={data}
                />
            </Link>
        );
    }

    return null;
};

export default SearchResult;