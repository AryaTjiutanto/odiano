import { Link, useLocation } from "react-router-dom";
import ConnectLogo from "../../assets/img/logo/odiano-gradient.svg";
import { Bell, Home, Pencil, Search, User } from "lucide-react";
import { useAppSelector } from "../../hooks/useRedux";
import UserMenu from "./UserMenu";
import { usePostForm } from "../../providers/PostFormProvider";

const LeftSidebar = () => {
    const postForm = usePostForm();

    const unreadNotificationCount = useAppSelector((state) => state.notification.unreadCount);

    // location
    const location = useLocation();
    const pathName = location.pathname;

    // user data
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const userData = useAppSelector((state) => state.auth.user);

    return (
        <>
            <div className="w-full h-full flex flex-col items-center xl:items-start justify-between">
                <div className="w-full flex flex-col items-center xl:items-start">
                    <img src={ConnectLogo} className="w-9 xl:w-auto" />

                    {
                        (isAuthenticated && userData?.isOnboarded) &&
                        <>
                            <nav className="mt-20 xl:mt-16 w-full">
                                <ul className="w-full space-y-7 xl:space-y-5 text-neutral-200">
                                    <li className="w-full">
                                        <Link to={"/"} className={`w-full flex justify-center xl:justify-start items-center xl:space-x-5 text-lg 2xl:text-xl ${pathName == "/" && "text-white font-semibold"} duration-100`}>
                                            <Home className="size-7 w-fit xl:size-auto" />
                                            <span className="hidden xl:inline-block">
                                                Home
                                            </span>
                                        </Link>
                                    </li>
                                    <li className="w-full">
                                        <Link to={"/explore"} className={`w-full flex justify-center xl:justify-start items-center xl:space-x-5 text-lg 2xl:text-xl ${pathName.includes("explore") && "text-white font-semibold"} duration-100`}>
                                            <Search className="size-7 w-fit xl:size-auto" />
                                            <span className="hidden xl:inline-block">
                                                Explore
                                            </span>
                                        </Link>
                                    </li>
                                    <li className="w-full">
                                        <Link to={"/notification"} className={`w-full flex justify-center xl:justify-start items-center xl:space-x-5 text-lg 2xl:text-xl cursor-pointer ${pathName.includes("notification") && "text-white font-semibold"} `}>
                                            <div className="relative">
                                                <Bell className="size-7 xl:size-auto" />

                                                {
                                                    unreadNotificationCount > 0 &&
                                                    <div className="w-fit aspect-1 py-0.5 px-2 rounded-full bg-rose-500 absolute -top-3 left-[60%] text-[12px] font-bold grid place-content-center">
                                                        {unreadNotificationCount}
                                                    </div>
                                                }
                                            </div>
                                            <span className="hidden xl:inline-block">
                                                Notifications
                                            </span>
                                        </Link>
                                    </li>

                                    {/* comming soon */}
                                    {/* <li className="w-full">
                                        <Link to={""} className="w-full flex justify-center xl:justify-start items-center xl:space-x-5 text-lg 2xl:text-xl">
                                            <MessageCircle />
                                            <span>
                                                Chat
                                            </span>
                                        </Link>
                                    </li>
                                    <li className="w-full">
                                        <Link to={""} className="w-full flex justify-center xl:justify-start items-center xl:space-x-5 text-lg 2xl:text-xl">
                                            <Bookmark />
                                            <span>
                                                Bookmark
                                            </span>
                                        </Link>
                                    </li> */}

                                    {
                                        userData?.isOnboarded &&
                                        <li className="w-full">
                                            <Link to={`profile/${userData && userData?.username}`} className={`w-full flex justify-center xl:justify-start items-center xl:space-x-5 text-lg 2xl:text-xl ${pathName.includes("profile/") && "text-white font-semibold"} duration-100`}>
                                                <User className="size-7 xl:size-auto" />
                                                <span className="hidden xl:inline-block">
                                                    Profile
                                                </span>
                                            </Link>
                                        </li>
                                    }

                                    {/* comming soon */}
                                    {/* <li className="w-full">
                                        <Link to={""} className="w-full flex justify-center xl:justify-start items-center xl:space-x-5 text-lg 2xl:text-xl">
                                            <Settings />
                                            <span>
                                                Setting and privacy
                                            </span>
                                        </Link>
                                    </li> */}
                                </ul>
                            </nav>
                            {/* xl */}
                            <button onClick={postForm.open} className="w-40 h-14 bg-white rounded-xl mt-10 text-lg text-neutral-900 font-bold cursor-pointer hidden hover:bg-white/0 hover:text-neutral-100 border border-white duration-100 xl:grid xl:place-content-center">
                                Post
                            </button>

                            {/* md */}
                            <button className="xl:hidden mt-14 w-10 h-10 bg-neutral-50 rounded-full text-neutral-800 grid place-content-center" onClick={postForm.open}>
                                <Pencil className="size-4" />
                            </button>
                        </>
                    }
                </div>

                <UserMenu />
            </div>
        </>
    )
}

export default LeftSidebar;