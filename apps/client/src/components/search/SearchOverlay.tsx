import { type SearchSuggestionDTO, type SearchHistoryDTO, type SuccessResponseData, SEARCH_TYPES } from "@odiano/shared";
import SearchSkeletonLoading from "./SearchSkeletonLoading";
import { useMutation, useQuery } from "@tanstack/react-query";
import { searchKeys } from "../../queries/searchKeys";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import { api } from "../../libs/api";
import React, { forwardRef } from "react";
import { useAppSelector } from "../../hooks/useRedux";
import { deleteAllSearchHistory } from "../../services/searchHistory.service";
import useSetQueryDataHandler from "../../hooks/useSetQueryDataHandler";
import { notify } from "../../helpers/notification/notify.helper";
import SearchHistory from "./SearchHistory";
import SearchResult from "./Suggestion/SearchSuggestion";
import { useSearchInputContext } from "../../providers/SearchInputProvider";

type Props = {
    searchQueryData: SearchSuggestionDTO[] | null | undefined,
    isSearchQueryPending: boolean,
    floatingProps: React.HTMLProps<HTMLDivElement>
    floatingStyles: React.CSSProperties
}

const SearchOverlay = forwardRef<HTMLDivElement, Props>(({ floatingStyles, floatingProps, isSearchQueryPending, searchQueryData }, ref) => {
    const { query, isSearchPanelOpen } = useSearchInputContext();
    const isInitialized = useAppSelector((state) => state.auth.isInitialized);
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const setQueryDataHandler = useSetQueryDataHandler();

    // get search history
    const getSearchHistories = async (): Promise<SearchHistoryDTO[]> => {
        const response = await api.get<SuccessResponseData<SearchHistoryDTO[]>>("/search/history");

        if (!response.data.data) {
            throw Error('Data is missing');
        }

        return response.data.data;
    }

    const searchHistoryQuery = useQuery({
        queryKey: searchKeys.history,
        queryFn: getSearchHistories,
        staleTime: 30 * 10000,
        enabled: !!(isInitialized && isSearchPanelOpen && isAuthenticated),
        gcTime: DEFAULT_GC_TIME,
    })

    const isSearchResultEmpty = !(searchQueryData && searchQueryData.length > 0);
    const isSearchHistoryEmpty = !searchHistoryQuery.data || searchHistoryQuery.data.length == 0;

    // delete all history
    const allHistoryMutation = useMutation({
        mutationFn: deleteAllSearchHistory,

        onMutate: () => setQueryDataHandler<SearchHistoryDTO[]>(searchKeys.history, () => {
            return [];
        }),

        onError: () => setQueryDataHandler<SearchHistoryDTO[]>(searchKeys.history, (oldData) => {
            return oldData;
        })
    })

    const deleteAllSearchHistoryHandler = async () => {
        try {
            await allHistoryMutation.mutateAsync();
        } catch {
            notify.error({ title: "Fail", description: "Something went wrong" });
        }
    }

    return (
        <div className={`w-full overflow-y-auto ${isSearchPanelOpen ? 'max-h-100 opacity-100' : 'max-h-0 opacity-0 touch-none'} bg-black border border-neutral-700 rounded-lg transition-[max-height,opacity] duration-100 overflow-hidden`} ref={ref} style={floatingStyles} {...floatingProps}>
            <div className="w-full">
                {/* search history */}
                {
                    (searchHistoryQuery.isPending) ?
                        <div className="w-full space-y-2">
                            {
                                Array.from({ length: 3 }).map((_, i) => (
                                    <SearchSkeletonLoading key={`search-${i}`} />
                                ))
                            }
                        </div>
                        :
                        <>
                            {
                                (query.length == 0 && !isSearchHistoryEmpty) &&
                                <>
                                    <div className="w-full flex items-center justify-between px-5 py-3">
                                        <h1 className="text-xl font-semibold">Recent</h1>
                                        <button className="text-sky-500 hover:text-sky-600 duration-100 text-sm cursor-pointer" onClick={deleteAllSearchHistoryHandler}>
                                            Clear all
                                        </button>
                                    </div>
                                    {
                                        searchHistoryQuery.data.map((history, index) => (
                                            <SearchHistory data={history} key={`history-${history.targetId || index}`} />
                                        ))
                                    }
                                </>
                            }
                            {
                                (query.length == 0 && isSearchHistoryEmpty) &&
                                <div className="w-full h-20 grid place-content-center text-sm text-neutral-500">
                                    Try searching for people or tags
                                </div>
                            }
                        </>
                }

                {/* search result */}
                {
                    (query.length > 0 && !query.startsWith("#")) &&
                    <SearchResult data={{
                        type: SEARCH_TYPES.GENERAL,
                        data: null,
                        keyword: query,
                    }} />
                }
                {
                    (isSearchQueryPending && query.length > 0) ?
                        <div className="w-full space-y-2">
                            {
                                Array.from({ length: 3 }).map((_, i) => (
                                    <SearchSkeletonLoading key={`search-${i}`} />
                                ))
                            }
                        </div>
                        :
                        <>
                            {
                                (query.length > 0 && !isSearchResultEmpty) &&
                                searchQueryData?.map((data: SearchSuggestionDTO) => (
                                    <SearchResult data={data} />
                                ))
                            }
                        </>
                }
            </div>
        </div>
    )
})

export default SearchOverlay;