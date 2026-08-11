import { offset, shift, useDismiss, useFloating, useFocus, useInteractions } from "@floating-ui/react";
import { Search } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { searchKeys } from "../../queries/searchKeys";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import { getSearchResult } from "../../services/search.service";

type Props = {
    searchIconPosition? : "left" | "right",
    width? : "full" | "small",
}

// search overlay - lazy loading
const SearchOverlay = lazy(() => 
    import("./SearchOverlay")
)


const SearchBar = ({searchIconPosition = "left", width = "small"} : Props) => {
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
        placement: searchIconPosition == "right" ? "bottom-end" : "bottom-start",
        middleware: [
            shift(),
            offset(10),  
        ],
        open: isSearchPanelOpen,
        onOpenChange: setIsSearchPanelOpen,
    });

    const focus = useFocus(context)
    const dismiss = useDismiss(context);

    const { getFloatingProps, getReferenceProps } = useInteractions([dismiss, focus])


    return (
        <>
            <Suspense>
                <SearchOverlay searchQueryData={searchQuery.data} floatingStyles={floatingStyles} floatingProps={getFloatingProps()} isSearchPanelOpen={isSearchPanelOpen} isSearchQueryPending={searchQuery.isPending} query={query} ref={refs.setFloating}/>
            </Suspense>

            {/* search input */}
            <div className={`${width == "full" ? "w-full" : isSearchPanelOpen ? 'sm:w-56 md:w-70 lg:w-82' : 'sm:w-50 md:w-64'} h-fit relative duration-100`} ref={refs.setReference} {...getReferenceProps()}>
                <div className={`w-full duration-100 h-11 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center ${searchIconPosition == "right" && "flex-row-reverse"} pr-2`}>
                    <button className="w-10 h-full grid place-content-center text-neutral-300 cursor-pointer">
                        <Search className="w-4" />
                    </button>
                    <input className={`flex-1 w-full h-full default-input-text-behaviour ${searchIconPosition == "right" && "px-4"}`} placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
            </div>
        </>
    );
}

export default SearchBar;