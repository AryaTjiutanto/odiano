import { Link, useLocation } from "react-router-dom";
import ConnectLogo from "../../assets/img/logo/connect-gradient.svg";
import { Bell, EllipsisVertical, Home, Pencil, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { useState } from "react";
import { logout } from "../../features/auth/auth.thunk";
import Profile from "./Profile";

type Props = {
    setShowCreatePropsSection: React.Dispatch<React.SetStateAction<boolean>>,

    isNotificationSidebarVisible: boolean,
    setIsNotificationSidebarVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const Sidebar = ({ setIsNotificationSidebarVisible, isNotificationSidebarVisible, setShowCreatePropsSection }: Props) => {
    const dispatch = useAppDispatch();

    // location
    const location = useLocation();
    const pathName = location.pathname;

    // user data
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const isInitialized = useAppSelector((state) => state.auth.isInitialized);
    const userData = useAppSelector((state) => state.auth.user);

    // profile
    const [isProfilePopoverHidden, setIsProfilePopoverHidden] = useState<boolean>(true);

    const profileLink = !isAuthenticated
        ? "/signin"
        : !userData?.isEmailVerified
            ? "/email/verify"
            : "/onboarding";

    // openSidebar
    const handleOpenNotificationSidebar = () => {
        if (!isInitialized) {
            return;
        }

        setIsNotificationSidebarVisible(!isNotificationSidebarVisible)
    }

    // logout
    const logoutHandler = () => {
        dispatch(logout());
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
                            <button className="xl:hidden mt-14 w-10 h-10 bg-neutral-50 rounded-full text-neutral-800 grid place-content-center">
                                <Pencil className="size-4"/>
                            </button>
                        </>
                    }
                </div>

                {
                    isAuthenticated && userData?.isOnboarded ?
                        <div className="relative w-fit xl:w-full">
                            {/* popover */}
                            <div className={`w-48 xl:w-[120%] 2xl:w-full absolute -top-20 duration-100 font-bold ${isProfilePopoverHidden ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-fit"}`}>
                                <div className="w-full relative rounded-xl z-2 overflow-hidden bg-neutral-950">
                                    <button className="w-full px-5 py-4 text-left bg-neutral-950 hover:text-neutral-500 cursor-pointer duration-100" onClick={logoutHandler}>
                                        Log out @{userData.username}
                                    </button>
                                </div>
                                <div className="w-4 h-4 bg-neutral-950 right-0 left-0 mx-auto -bottom-1.5 rotate-45 absolute z-1"></div>
                            </div>

                            {/* button */}
                            <button className="w-fit xl:w-full flex items-center justify-between xl:space-x-2 2xl:space-x-10 cursor-pointer z-1" onClick={() => setIsProfilePopoverHidden(!isProfilePopoverHidden)}>
                                <div className="flex flex-1 items-center xl:space-x-3">
                                    <div className="w-12 h-12">
                                        <Profile data={userData.profileImage} />
                                    </div>
                                    <div className="text-left hidden xl:inline-block">
                                        <h1 className="text-base font-semibold">{userData.name}</h1>
                                        <p className="text-sm text-neutral-700">
                                            @{userData.username}
                                        </p>
                                    </div>
                                </div>
                                <div className="hidden xl:inline-block">
                                    <EllipsisVertical />
                                </div>
                            </button>
                        </div>
                        :
                        <Link to={profileLink}>
                            <button className="w-full flex items-center justify-between space-x-10 cursor-pointer">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12">
                                        <Profile data={null} />
                                    </div>

                                    <div className="text-left">
                                        {!isAuthenticated ? (
                                            <h1 className="text-base font-semibold">
                                                Create an account or sign in
                                            </h1>
                                        ) : !userData?.isEmailVerified ? (
                                            <h1 className="text-base font-semibold">
                                                Verify your Email
                                            </h1>
                                        ) : (
                                            <h1 className="text-base font-semibold">
                                                Complete your data
                                            </h1>
                                        )}
                                    </div>
                                </div>
                            </button>
                        </Link>
                }
            </div>
        </>
    )
}

export default Sidebar;