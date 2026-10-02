import { createContext, useContext, useState } from "react";
import useSetQueryDataHandler from "../hooks/useSetQueryDataHandler";
import { useMutation } from "@tanstack/react-query";
import type { SearchHistoryDTO, UserSearchDTO, HashTagSearchDTO, GeneralSearchDTO } from "@odiano/shared";
import { recordSearchHistory } from "../services/searchHistory.service";
import { searchKeys } from "../queries/searchKeys";
import { useAppSelector } from "../hooks/useRedux";

type SearchInputContextType = {
    query: string,
    setQuery: React.Dispatch<React.SetStateAction<string>>,
    isSearchPanelOpen: boolean,
    setIsSearchPanelOpen: React.Dispatch<React.SetStateAction<boolean>>,
    handleSearch: (query: string, fn?: () => void) => void,
    handleMutation: (data : UserSearchDTO | HashTagSearchDTO | GeneralSearchDTO) => void,
}

const SearchInputContext = createContext<SearchInputContextType | null>(null);

export const SearchInputProvider = ({ children }: any) => {
    const currentUserId = useAppSelector((state) => state.auth.user?.id);
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const setQueryDataHandler = useSetQueryDataHandler();

    const [query, setQuery] = useState<string>("");
    const [isSearchPanelOpen, setIsSearchPanelOpen] = useState<boolean>(false);

    const handleSearch = (query: string, fn?: () => void) => {
        setIsSearchPanelOpen(false);
        setQuery(query);

        if (!fn) return;
        fn();
    }

    // history mutation
    const historyMutation = useMutation({
        mutationKey: searchKeys.history,
        mutationFn: (data : UserSearchDTO | HashTagSearchDTO | GeneralSearchDTO) => recordSearchHistory(data.data?.id, data.type, data.keyword),

        onSuccess: (response, data) => setQueryDataHandler<SearchHistoryDTO[]>(searchKeys.history, (oldData) => {
            if (!currentUserId) return;

            const newData = {
                id : response.data?.id,
                targetId: data.data?.id,
                user: currentUserId,
                keyword: data.keyword,
                updatedAt: new Date(),
                target : data,
            } as SearchHistoryDTO

            const newDataSorted = [
                newData,
                ...(oldData.filter((old) => !data || old.targetId !== data.data?.id || old.keyword !== data.keyword)),
            ];

            return newDataSorted;
        }),
    });

    const handleMutation = async (data : UserSearchDTO | HashTagSearchDTO | GeneralSearchDTO) => {
        if(!isAuthenticated) return;

        await historyMutation.mutateAsync(data);
    }

    return (
        <SearchInputContext.Provider value={{
            query,
            setQuery,
            isSearchPanelOpen,
            setIsSearchPanelOpen,
            handleSearch,
            handleMutation,
        }}>
            {children}
        </SearchInputContext.Provider>
    )
}

export const useSearchInputContext = () => {
    const context = useContext(SearchInputContext);

    if (!context) {
        throw new Error("useSearchInputContext must be used within a SearchInputProvider");
    }

    return context;
}