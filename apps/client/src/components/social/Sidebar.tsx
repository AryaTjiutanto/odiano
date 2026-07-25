import { Link, useLocation } from "react-router-dom";
import ConnectLogo from "../../assets/img/logo/connect-gradient.svg";
import { Bell, Home, Pencil, User } from "lucide-react";
import { useAppSelector } from "../../hooks/useRedux";
import UserMenu from "../sidebar/UserMenu";

type Props = {
    setShowCreatePropsSection: React.Dispatch<React.SetStateAction<boolean>>,

    isNotificationSidebarVisible: boolean,
    setIsNotificationSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const Sidebar = ({ setIsNotificationSidebarVisible, isNotificationSidebarVisible, setShowCreatePropsSection }: Props) => {
    // location
    const location = useLocation();
    const pathName = location.pathname;

    // user data
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const isInitialized = useAppSelector((state) => state.auth.isInitialized);
    const userData = useAppSelector((state) => state.auth.user);

    // openSidebar
    const handleOpenNotificationSidebar = () => {
        if (!isInitialized) {
            return;
        }

        setIsNotificationSidebarVisible(!isNotificationSidebarVisible)
    }

    return (
        <>
            <div className="w-full h-full flex flex-col items-center xl:items-start justify-between">
                <div className="w-full flex flex-col items-center xl:items-start">
                    <img src={ConnectLogo} className="w-9 xl:w-auto" />
                    <nav className="mt-20 xl:mt-16 w-full">
                        <ul className="w-full space-y-7 xl:space-y-5">
                            <li className="w-full">
                                <Link to={"/"} className={`w-full flex justify-center xl:justify-start items-center xl:space-x-5 text-lg ${pathName == "/" && "text-white font-semibold"} duration-100`}>
                                    <Home className="size-7 w-fit xl:size-auto" />
                                    <span className="hidden xl:inline-block">
                                        Home
                                    </span>
                                </Link>
                            </li>
                            {/* comming soon */}
                            {/* <li className="w-full">
                                <Link to={""} className="w-full flex justify-center xl:justify-start items-center xl:space-x-5 text-lg">
                                    <Search />
                                    <span>
                                        Explore
                                    </span>
                                </Link>
                            </li> */}
                            {
                                isAuthenticated &&
                                <>
                                    <li className="w-full">
                                        <button onClick={handleOpenNotificationSidebar} className="w-full flex justify-center xl:justify-start items-center xl:space-x-5 text-lg cursor-pointer">
                                            <Bell className="size-7 xl:size-auto" />
                                            <span className="hidden xl:inline-block">
                                                Notification
                                            </span>
                                        </button>
                                    </li>

                                    {/* comming soon */}
                                    {/* <li className="w-full">
                                        <Link to={""} className="w-full flex justify-center xl:justify-start items-center xl:space-x-5 text-lg">
                                            <MessageCircle />
                                            <span>
                                                Chat
                                            </span>
                                        </Link>
                                    </li>
                                    <li className="w-full">
                                        <Link to={""} className="w-full flex justify-center xl:justify-start items-center xl:space-x-5 text-lg">
                                            <Bookmark />
                                            <span>
                                                Bookmark
                                            </span>
                                        </Link>
                                    </li> */}

                                    {
                                        userData?.isOnboarded &&
                                        <li className="w-full">
                                            <Link to={`profile/${userData && userData?.username}`} className={`w-full flex justify-center xl:justify-start items-center xl:space-x-5 text-lg ${pathName == "/profile" && "text-white font-semibold"} duration-100`}>
                                                <User className="size-7 xl:size-auto" />
                                                <span className="hidden xl:inline-block">
                                                    Profile
                                                </span>
                                            </Link>
                                        </li>
                                    }

                                    {/* comming soon */}
                                    {/* <li className="w-full">
                                        <Link to={""} className="w-full flex justify-center xl:justify-start items-center xl:space-x-5 text-lg">
                                            <Settings />
                                            <span>
                                                Setting and privacy
                                            </span>
                                        </Link>
                                    </li> */}
                                </>
                            }
                        </ul>
                    </nav >
                    {
                        (isAuthenticated && userData?.isOnboarded) &&
                        <>
                            {/* xl */}
                            <button onClick={() => setShowCreatePropsSection(true)} className="w-40 h-14 bg-white rounded-xl mt-10 text-lg text-neutral-900 font-bold cursor-pointer hidden hover:bg-white/0 hover:text-neutral-100 border border-white duration-100 xl:grid xl:place-content-center">
                                Post
                            </button>
                            
                            {/* md */}
                            <button className="xl:hidden mt-14 w-10 h-10 bg-neutral-50 rounded-full text-neutral-800 grid place-content-center" onClick={() => setShowCreatePropsSection(true)}>
                                <Pencil className="size-4"/>
                            </button>
                        </>
                    }
                </div>

                <UserMenu/>
            </div>
        </>
    )
}

export default Sidebar;