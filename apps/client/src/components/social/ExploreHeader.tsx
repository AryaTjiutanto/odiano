import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../hooks/useRedux"
import SearchInput from "../search/SearchInput";
import { useSearchSectionContext } from "../../providers/SearchSectionProvider";

export const ExploreHeader = () => {
    const searchSectionContext = useSearchSectionContext();

    const isInitialized = useAppSelector(state => state.auth.isInitialized);
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("q");

    return (
        <section className={`w-full sticky sm:top-0 pt-6 sm:pt-6 lg:pt-5 xl:pt-9 hidden sm:flex justify-between items-center bg-black z-23 ${isAuthenticated ? "pb-4" : "pb-0"}`}>
            {
                (isInitialized && isAuthenticated) &&
                <div className="w-full">
                    {/* search bar */}
                    <SearchInput width={"full"} />

                    {
                        searchQuery &&
                        <div className="w-full h-12 grid grid-cols-3 mt-3">
                            <button className={`flex items-center justify-center space-x-2 border-b ${searchSectionContext.currentSection == "posts" ? "border-b-2 border-neutral-100 text-neutral-200" : "border-neutral-800 text-neutral-500 hover:text-neutral-300 duration-100 cursor-pointer hover:border-neutral-700"} font-medium`} onClick={() => searchSectionContext.setCurrentSection("posts")}>
                                Posts
                            </button>
                            <button className={`flex items-center justify-center space-x-2 border-b ${searchSectionContext.currentSection == "people" ? "border-b-2 border-neutral-100 text-neutral-200" : "border-neutral-800 text-neutral-500 hover:text-neutral-300 duration-100 cursor-pointer hover:border-neutral-700"} font-medium`} onClick={() => searchSectionContext.setCurrentSection("people")}>
                                People
                            </button>
                            <button className={`flex items-center justify-center space-x-2 border-b ${searchSectionContext.currentSection == "media" ? "border-b-2 border-neutral-100 text-neutral-200" : "border-neutral-800 text-neutral-500 hover:text-neutral-300 duration-100 cursor-pointer hover:border-neutral-700"} font-medium`} onClick={() => searchSectionContext.setCurrentSection("media")}>
                                Media
                            </button>
                        </div>
                    }
                </div>
            }
        </section >
    )
}