import { useAppSelector } from "../../hooks/useRedux";
import SearchBar from "../search/Search";

type Props = {
    mode: "search" | "all",
}

const SocialHeader = ({ mode }: Props) => {
    const isInitialized = useAppSelector(state => state.auth.isInitialized);
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

    return (
        <section className={`w-full sticky sm:top-0 pt-6 sm:pt-6 lg:pt-5 xl:pt-9 hidden sm:flex justify-between items-center bg-black/10 backdrop-blur-2xl z-23 ${isAuthenticated ? " pb-6" : "pb-0"}`}>
            {
                (isInitialized && isAuthenticated) &&
                <>
                    {/* search bar */}
                    <SearchBar width={mode == "search" ? "full" : "small"}/>

                    {/* filter */}
                    {
                        mode == "all" &&
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
                    }
                </>
            }
        </section >
    )
}

export default SocialHeader;