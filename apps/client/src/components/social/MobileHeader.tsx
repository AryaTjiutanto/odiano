import { Bell, Plus } from "lucide-react";
import { useAppSelector } from "../../hooks/useRedux";
import { Link, useLocation } from "react-router-dom";
import { usePostForm } from "../../providers/PostFormProvider";

const MobileHeader = () => {
    const currentUserData = useAppSelector((state) => state.auth.user);
    const isInitialized = useAppSelector(state => state.auth.isInitialized);
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
    const postForm = usePostForm();
    const unreadNotificationCount = useAppSelector((state) => state.notification.unreadCount);

    // location
    const location = useLocation();
    const pathName = location.pathname;

    // check type
    let headerType : "profile" | "home" | null = null;

    if(pathName == "/") {
        headerType = "home";
    } else if(pathName.startsWith("/profile")) {
        const username = pathName.split("/")[2];
        if(username != currentUserData?.username) return;
        
        headerType = "profile";
    }

    if(headerType == null) return <></>

    return (
        <>
            <section className="px-5 sticky top-0 pt-6 sm:pt-6 lg:pt-5 xl:pt-9 pb-6 flex sm:hidden justify-between items-center bg-black z-23">
                {
                    isAuthenticated &&
                    <button onClick={postForm.open}>
                        <Plus className="w-9" />
                    </button>
                }
                <h1 className="text-2xl font-semibold font-serif text-white">
                    Odiano
                </h1>

                {
                    (isInitialized && isAuthenticated) &&
                    <Link to={"/notification"} className={`cursor-pointer `}>
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
        </>
    );
}

export default MobileHeader;