import { offset, shift, useDismiss, useFloating, useFocus, useInteractions } from "@floating-ui/react";
import { Search } from "lucide-react";
import { useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { searchKeys } from "../../queries/searchKeys";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import SearchOverlay from "./SearchOverlay";
import { getSearchResult } from "../../services/search.service";

const SearchBar = () => {
    const [query, setQuery] = useState<string>("");
    const debounceValue = useDebounce<string>(query);

    // query
    const searchQuery = useQuery({
        queryKey: searchKeys.search(debounceValue),
        queryFn: async () => await getSearchResult(debounceValue),
        staleTime: 60 * 1000,
        enabled: !!(debounceValue && debounceValue.length > 0),
        gcTime: DEFAULT_GC_TIME
    });

    // handle floating search panel
    const [isSearchPanelOpen, setIsSearchPanelOpen] = useState<boolean>(false);
    const { refs, floatingStyles, context } = useFloating({
        placement: "bottom-start",
        middleware: [
            shift(),
            offset(8),
        ],
        open: isSearchPanelOpen,
        onOpenChange: setIsSearchPanelOpen,
    });

    const focus = useFocus(context)
    const dismiss = useDismiss(context);

    const { getFloatingProps, getReferenceProps } = useInteractions([dismiss, focus])

    return (
        <>
            <SearchOverlay searchQueryData={searchQuery.data} floatingStyles={floatingStyles} floatingProps={getFloatingProps()} isSearchPanelOpen={isSearchPanelOpen} isSearchQueryPending={searchQuery.isPending} query={query} ref={refs.setFloating}/>

            {/* search input */}
            <div className={`${isSearchPanelOpen ? 'w-82' : 'w-64'} h-fit relative duration-100`} ref={refs.setReference} {...getReferenceProps()}>
                <div className="w-full duration-100 h-11 rounded-lg bg-neutral-950 border border-neutral-700 flex items-center pr-2">
                    <button className="w-10 h-full grid place-content-center text-neutral-300 cursor-pointer">
                        <Search className="w-4" />
                    </button>
                    <input className="flex-1 w-full h-full default-input-text-behaviour" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
            </div>
        </>
    );
}

export default SearchBar;