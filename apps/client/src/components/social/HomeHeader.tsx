import SearchBar from "../search/Search";
import odiano from "../../assets/img/logo/odiano.svg"
import { useAppSelector } from "../../hooks/useRedux";
import { Link } from "react-router-dom";

const HomeHeader = () => {
    const isInitialized = useAppSelector(state => state.auth.isInitialized);
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)

    return (
        <>
            {/* heading - mobile */}
            <section className="w-full sticky top-0 pt-6 sm:pt-6 lg:pt-5 xl:pt-9 pb-6 flex sm:hidden justify-between items-center bg-black/10 backdrop-blur-2xl z-23">
                <img src={odiano} className="w-10" />

                {
                    (isInitialized && isAuthenticated) &&
                    <SearchBar searchIconPosition="right" />
                }

                {
                    (isInitialized && !isAuthenticated) &&
                    <div className="flex space-x-3 items-center font-medium">
                        <Link to={"/signin"}>
                            Sign In
                        </Link>
                        <Link to={"/signup"} className="w-20 py-1 bg-neutral-100 text-neutral-900 rounded-full flex items-center justify-center">
                            Sign up
                        </Link>
                    </div>
                }
            </section>

            {/* heading */}
            <section className={`w-full sticky sm:top-0 pt-6 sm:pt-6 lg:pt-5 xl:pt-9 hidden sm:flex justify-between items-center bg-black/10 backdrop-blur-2xl z-23 ${isAuthenticated ? " pb-6" : "pb-0"}`}>
                {
                    (isInitialized && isAuthenticated) &&
                    <>
                        {/* search bar */}
                        < SearchBar />

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