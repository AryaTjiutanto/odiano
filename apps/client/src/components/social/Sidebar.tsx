import { Link } from "react-router-dom";
import ConnectLogo from "../../assets/img/logo/connect-gradient.svg";
import { Bell, Bookmark, EllipsisVertical, Home, MessageCircle, Search, Settings, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../shared/hooks/useRedux";
import { useState } from "react";
import { logout } from "../../features/auth/auth.thunk";

const Sidebar = () => {
    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const userData = useAppSelector((state) => state.auth.user);

    const [isProfilePopoverHidden, setIsProfilePopoverHidden] = useState<boolean>(true);

    const logoutHandler = () => {
        dispatch(logout());
    }

    return (
        <div className="w-full h-full flex flex-col justify-between">
            <div>
                <img src={ConnectLogo} />
                <nav className="mt-16">
                    <ul className="space-y-5">
                        <li>
                            <Link to={""} className="flex items-center space-x-5 text-lg">
                                <Home />
                                <span>
                                    Home
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link to={""} className="flex items-center space-x-5 text-lg">
                                <Search />
                                <span>
                                    Explore
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link to={""} className="flex items-center space-x-5 text-lg">
                                <Bell />
                                <span>
                                    Notification
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link to={""} className="flex items-center space-x-5 text-lg">
                                <MessageCircle />
                                <span>
                                    Chat
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link to={""} className="flex items-center space-x-5 text-lg">
                                <Bookmark />
                                <span>
                                    Bookmark
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link to={""} className="flex items-center space-x-5 text-lg">
                                <User />
                                <span>
                                    Profile
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link to={""} className="flex items-center space-x-5 text-lg">
                                <Settings />
                                <span>
                                    Setting and privacy
                                </span>
                            </Link>
                        </li>
                    </ul>
                </nav >
                <button className="w-40 h-14 bg-white rounded-xl mt-10 text-lg text-neutral-900 font-bold cursor-pointer hover:bg-white/0 hover:text-neutral-100 border border-white duration-100">
                    Post
                </button>
            </div>

            {
                isAuthenticated && userData?.isOnboarded ?
                    <div className="relative min-w-62 w-fit">
                        {/* popover */}
                        <div className={`w-full absolute -top-20 h-fit duration-100 font-bold ${isProfilePopoverHidden ? "opacity-0 h-0 overflow-hidden" : "opacity-100"}`}>
                            <div className="w-full relative rounded-xl z-2 overflow-hidden bg-neutral-900">
                                <button className="w-full px-5 py-4 text-left bg-neutral-900 hover:text-neutral-500 cursor-pointer duration-100" onClick={logoutHandler}>
                                    Log out @{userData.username}
                                </button>
                            </div>
                            <div className="w-4 h-4 bg-neutral-900 right-0 left-0 mx-auto -bottom-1.5 rotate-45 absolute z-1"></div>
                        </div>

                        {/* button */}
                        <button className="w-full flex items-center justify-between space-x-10 cursor-pointer" onClick={() => setIsProfilePopoverHidden(!isProfilePopoverHidden)}>
                            <div className="flex items-center space-x-3">
                                {
                                    userData?.profileImage?.url ?
                                        <div className="w-12 h-12 rounded-full overflow-hidden">
                                            <img src={userData.profileImage.url} />
                                        </div>
                                        :
                                        <div className="w-12 h-12 rounded-full overflow-hidden">
                                            <div className="w-full h-full bg-neutral-800 grid place-content-center">
                                                <User />
                                            </div>
                                        </div>
                                }
                                <div className="text-left">
                                    <h1 className="text-base font-semibold">{userData.name}</h1>
                                    <p className="text-sm text-neutral-700">
                                        @{userData.username}
                                    </p>
                                </div>
                            </div>
                            <EllipsisVertical />
                        </button>
                    </div>
                    :
                    <Link to={isAuthenticated ? "/onboarding" : "/signin"}>
                        <button className="min-w-62 w-fit flex items-center justify-between space-x-10 cursor-pointer">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden">
                                    <div className="w-full h-full bg-neutral-800 grid place-content-center">
                                        <User />
                                    </div>
                                </div>
                                <div>
                                    {
                                        isAuthenticated ?
                                            <h1 className="text-base font-semibold">Complete you data</h1>
                                            :
                                            <h1 className="text-base font-semibold">Create an account or signin</h1>
                                    }
                                </div>
                            </div>
                        </button>
                    </Link>
            }
        </div>
    )
}

export default Sidebar;