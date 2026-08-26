import { offset, shift, useDismiss, useFloating, useFocus, useInteractions } from "@floating-ui/react";
import { Search } from "lucide-react";
import { lazy, Suspense } from "react";
import useDebounce from "../../hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { searchKeys } from "../../queries/searchKeys";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import { getSearchSuggestions } from "../../services/search.service";
import { useSearchInputContext } from "../../providers/SearchInputProvider";
import { SEARCH_TYPES } from "@odiano/shared";
import { useNavigate } from "react-router-dom";

type Props = {
    searchIconPosition? : "left" | "right",
    width? : "full" | "small",
}

// search overlay - lazy loading
const SearchOverlay = lazy(() => 
    import("./SearchOverlay")
)

const SearchInput = ({searchIconPosition = "left", width = "small"} : Props) => {
    const { query, setQuery, isSearchPanelOpen, setIsSearchPanelOpen, handleSearch, handleMutation } = useSearchInputContext();
    const navigate = useNavigate();

    const debounceValue = useDebounce<string>(query);

    // query
    const searchQuery = useQuery({
        queryKey: searchKeys.searchSuggestions(debounceValue),
        queryFn: async () => await getSearchSuggestions(debounceValue),
        staleTime: 90 * 1000,
        enabled: !!(debounceValue && debounceValue.length > 0),
        gcTime: DEFAULT_GC_TIME
    });

    // handle floating search panel
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

    // handle submit
    const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!query || query.length <= 0) return;

        handleSearch(query, () => handleMutation({
            type: SEARCH_TYPES.GENERAL,
            data: null,
            keyword: query,
        }))

        navigate(`/search?${new URLSearchParams({
            q: query,
        }).toString()}`);
    }

    return (
        <>
            <Suspense>
                <SearchOverlay searchQueryData={searchQuery.data} floatingStyles={floatingStyles} floatingProps={getFloatingProps()} isSearchQueryPending={searchQuery.isPending} ref={refs.setFloating}/>
            </Suspense>

            {/* search input */}
            <form onSubmit={handleSubmit} className={`${width == "full" ? "w-full" : isSearchPanelOpen ? 'sm:w-56 md:w-70 lg:w-82' : 'sm:w-50 md:w-64'} h-fit relative duration-100`} ref={refs.setReference} {...getReferenceProps()}>
                <div className={`w-full duration-100 h-12 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center ${searchIconPosition == "right" && "flex-row-reverse"} pr-2`}>
                    <button type="submit" className="w-10 h-full grid place-content-center text-neutral-300 cursor-pointer">
                        <Search className="w-4" />
                    </button>
                    <input className={`flex-1 w-full h-full default-input-text-behaviour ${searchIconPosition == "right" && "px-4"}`} placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
            </form>
        </>
    );
}

export default SearchInput;