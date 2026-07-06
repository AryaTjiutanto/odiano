import { offset, shift, useDismiss, useFloating, useFocus, useInteractions } from "@floating-ui/react";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { searchKeys } from "../../queries/searchKeys";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import type { SearchDTO, SuccessResponseData } from "@connect/shared";
import { api } from "../../libs/api";
import SearchSkeletonLoading from "../search/SearchSkeletonLoading";
import { Link } from "react-router-dom";
import Profile from "./Profile";

const SearchBar = () => {
    const [query, setQuery] = useState<string>("");
    const debounceValue = useDebounce<string>(query);

    // query
    const getSearchResult = async (): Promise<SearchDTO> => {
        const response = await api.get<SuccessResponseData<SearchDTO>>("search/", {
            params: {
                q: debounceValue,
            }
        })

        if (!response.data.data) {
            throw new Error("Data is empty");
        }

        return response.data.data;
    }

    const searchQuery = useQuery({
        queryKey: searchKeys.search(debounceValue),
        queryFn: getSearchResult,
        staleTime: 60 * 1000,
        enabled: !!(debounceValue && debounceValue.length > 0),
        gcTime: DEFAULT_GC_TIME
    });

    useEffect(() => {
        console.log(searchQuery.data);
    }, [searchQuery.data]);

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

            <div className={`absolute top-14 w-full overflow-y-auto ${isSearchPanelOpen ? 'max-h-100 opacity-100' : 'max-h-0 opacity-0 touch-none'} bg-neutral-950 border border-neutral-700 rounded-lg transition-[max-height,opacity] duration-100 overflow-hidden`} ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
                {
                    searchQuery.isPending ?
                        <div className="w-full space-y-2">
                            {
                                Array.from({ length: 3 }).map((_, i) => (
                                    <SearchSkeletonLoading key={`search-${i}`} />
                                ))
                            }
                        </div>
                        :
                        <div className="w-full py-3">
                            {
                                searchQuery.data?.users.map((user) => (
                                    <Link to={`/profile/${user.username}`}>
                                        <article className="w-full flex items-center px-6 py-3 space-x-2 hover:bg-neutral-800 duration-100">
                                            <div className="w-12 h-12 rounded-full overflow-hidden">
                                                <Profile data={user.profileImage} />
                                            </div>
                                            <div className="flex-1 w-full flex flex-col">
                                                <h1 className="font-semibold">
                                                    {user.username ?? ""}
                                                </h1>
                                                <h2 className="text-neutral-400">
                                                    {user.name ?? ""}
                                                </h2>
                                            </div>
                                        </article>
                                    </Link>
                                ))
                            }
                        </div>
                }
            </div>

            {/* search input */}
            <div className={`${isSearchPanelOpen ? 'w-82' : 'w-64'} h-fit relative duration-100`} ref={refs.setReference} {...getReferenceProps()}>
                <div className="w-full duration-100 h-11 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center pr-2">
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