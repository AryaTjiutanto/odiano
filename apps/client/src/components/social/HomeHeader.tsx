import SearchInput from "../search/SearchInput";
import odiano from "../../assets/img/logo/odiano.svg"
import { useAppSelector } from "../../hooks/useRedux";
import { Link } from "react-router-dom";
import SocialHeader from "./SocialHeader";

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
                    <SearchInput searchIconPosition="right" />
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

            {/* header */}
            <SocialHeader mode="all"/>
        </>
    )
}

export default HomeHeader;