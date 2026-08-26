import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSearchInputContext } from "../../providers/SearchInputProvider";
import { useSearchSectionContext } from "../../providers/SearchSectionProvider";
import PostSection from "../../components/search/section/PostSection";
import PeopleSection from "../../components/search/section/PeopleSection";
import PostMediaSection from "../../components/search/section/PostMediaSection";

const Search = () => {
    const searchSectionContext = useSearchSectionContext();

    const searchInputContext = useSearchInputContext();
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("q");

    useEffect(() => {
        document.title = `${searchQuery || "Search"} - Odiano`;
        searchInputContext.setQuery(searchQuery || "");
    }, [searchQuery]);

    if(!searchQuery) return <></>

    return (
        <>
            {/* head */}
            <title>search - Odiano</title>
            <meta
                name="description"
                content="odiano with friends, share posts, and explore communities."
            />

            {/* body */}
            <div className="mt-2 space-y-6 sm:pb-6">
                {
                    searchSectionContext.currentSection == "posts" &&
                    <PostSection searchQuery={searchQuery} />
                }
                {
                    searchSectionContext.currentSection == "people" &&
                    <PeopleSection searchQuery={searchQuery} />
                }
                {
                    searchSectionContext.currentSection == "media" &&
                    <PostMediaSection searchQuery={searchQuery} />
                }
            </div>
        </>
    )
}

export default Search;