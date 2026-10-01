import { Home, Search, User } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useAppSelector } from "../../hooks/useRedux"
import Profile from "../profile/Profile";
import StackLink from "../stack/StackLink";

export const BottomNavigation = () => {
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const isInitialized = useAppSelector(state => state.auth.isInitialized);
    const userData = useAppSelector(state => state.auth.user);

    const location = useLocation();

    // display
    if (!isInitialized) return null;

    if (!isAuthenticated) return null;

    return (
        <nav className="h-16 w-full bg-black sm:hidden grid grid-cols-3 z-25 fixed bottom-0 left-0 border-t border-neutral-800">
            <StackLink to={"/"}>
                <button className={`grid place-content-center w-full h-full group duration-100 ${location.pathname == "/" ? "text-white" : "text-neutral-400"}`}>
                    <Home />
                </button>
            </StackLink>
            <StackLink to={"/explore"}>
                <button className="grid place-content-center w-full h-full text-neutral-400">
                    <Search />
                </button>
            </StackLink>
            <StackLink to={`/profile/${userData?.username}`}>
                <button className={`grid place-content-center w-full h-full duration-100 ${location.pathname.includes("profile") ? "text-white" : "text-neutral-400"}`}>
                    {
                        isInitialized ?
                            <div className="w-8">
                                <Profile data={userData?.profileImage} />
                            </div>
                            :
                            <User />
                    }
                </button>
            </StackLink>
        </nav>
    )
}