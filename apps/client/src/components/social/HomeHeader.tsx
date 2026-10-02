import SearchInput from "../search/SearchInput";
import { useAppSelector } from "../../hooks/useRedux";
import { useSearchInputContext } from "../../providers/SearchInputProvider";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const HomeHeader = () => {
    const location = useLocation();
    const {setQuery} = useSearchInputContext();
    const isInitialized = useAppSelector(state => state.auth.isInitialized);
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)

    useEffect(() => {
        if(location.pathname != "/") return;
        setQuery("");
    }, [location, setQuery])

    return (
        <>
            {/* header */}
            <section className={`w-full sticky sm:top-0 pt-6 sm:pt-6 lg:pt-5 xl:pt-9 hidden sm:flex justify-between items-center bg-black z-23 ${isAuthenticated ? " pb-6" : "pb-0"}`}>
                {
                    (isInitialized && isAuthenticated) &&
                    <>
                        {/* search bar */}
                        <SearchInput width={"small"} key={"home-header-search"}/>

                        {/* filter */}
                        <div className="w-fit hidden sm:flex items-center space-x-4">
                            {/* comming soon */}
                            {/* <button className="text-sm font-semibold cursor-pointer duration-150 hover:text-neutral-100 text-neutral-500">
                            Following
                        </button> */}
                            <button className="text-sm font-semibold cursor-pointer duration-150 hover:text-neutral-100 text-neutral-100">
                                My Feed
                            </button>

                            {/* comming soon */}
                            {/* <button className="text-sm font-semibold cursor-pointer duration-150 hover:text-neutral-100 text-neutral-500">
                            Popular
                        </button> */}
                        </div>
                    </>
                }
            </section >
        </>
    )
}

export default HomeHeader;