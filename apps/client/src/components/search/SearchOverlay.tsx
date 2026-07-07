import type { SearchDTO, searchHistoryDTO, SuccessResponseData } from "@connect/shared";
import SearchHistory from "./SearchHistory";
import UserSearchResult from "./searchResult/UserSearchResult";
import SearchSkeletonLoading from "./SearchSkeletonLoading";
import { useQuery } from "@tanstack/react-query";
import { searchKeys } from "../../queries/searchKeys";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import { api } from "../../libs/api";
import React, { forwardRef } from "react";

type Props = {
    searchQueryData: SearchDTO | null | undefined,
    isSearchPanelOpen: boolean,
    isSearchQueryPending: boolean,
    floatingProps: React.HTMLProps<HTMLDivElement>
    floatingStyles: React.CSSProperties
    query: string,
}

const SearchOverlay = forwardRef<HTMLDivElement, Props>(({ isSearchPanelOpen, floatingStyles, floatingProps, isSearchQueryPending, query, searchQueryData }, ref) => {

    const getSearchHistories = async (): Promise<searchHistoryDTO[]> => {
        const response = await api.get<SuccessResponseData<searchHistoryDTO[]>>("/search/history");

        if (!response.data.data) {
            throw Error('Data is missing');
        }

        return response.data.data;
    }

    const searchHistoryQuery = useQuery({
        queryKey: searchKeys.history,
        queryFn: getSearchHistories,
        staleTime: 30 * 10000,
        gcTime: DEFAULT_GC_TIME,
    })

    const isLoading = (isSearchQueryPending && query.length > 0) || searchHistoryQuery.isPending;
    const isSearchResultEmpty = !(searchQueryData && searchQueryData.users.length > 0);
    const isSearchHistoryEmpty = !searchHistoryQuery.data || searchHistoryQuery.data.length == 0;

    return (
        <div className={`absolute top-14 w-full overflow-y-auto ${isSearchPanelOpen ? 'max-h-100 opacity-100' : 'max-h-0 opacity-0 touch-none'} bg-neutral-950 border border-neutral-700 rounded-lg transition-[max-height,opacity] duration-100 overflow-hidden`} ref={ref} style={floatingStyles} {...floatingProps}>
            {
                (isLoading) ?
                    <div className="w-full space-y-2">
                        {
                            Array.from({ length: 3 }).map((_, i) => (
                                <SearchSkeletonLoading key={`search-${i}`} />
                            ))
                        }
                    </div>
                    :
                    <div className="w-full py-3">
                        {/* search history */}
                        {
                            (query.length == 0 && !isSearchHistoryEmpty) &&
                            searchHistoryQuery.data.map((history) => (
                                <SearchHistory data={history} key={`history-${history.targetId}`} />
                            ))
                        }
                        {
                            (query.length == 0 && isSearchHistoryEmpty) &&
                            <div className="w-full h-20 grid place-content-center text-sm text-neutral-500">
                                Try searching for people or tags
                            </div>
                        }

                        {/* search result */}
                        {
                            (query.length > 0 && !isSearchResultEmpty) &&
                            searchQueryData?.users.map((user) => (
                                <UserSearchResult user={user} key={`search-user-${user.username}`} />
                            ))
                        }
                        {
                            (query.length > 0 && isSearchResultEmpty) &&
                            <div className="w-full h-20 grid place-content-center text-sm text-neutral-500">
                                No result found for "{query}"       
                            </div>
                        }
                    </div>
            }
        </div>
    )
})

export default SearchOverlay;