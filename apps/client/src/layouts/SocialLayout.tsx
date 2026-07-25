import { Outlet } from "react-router-dom";
import Sidebar from "../components/social/Sidebar";
import { lazy, Suspense, useEffect, useState } from "react";
import NotificationSidebar from "../components/social/NotificationSidebar";
import { registerNotificationListeners, unregisterNotificationListeners } from "../features/notification/notification.socket";

const CreatePostFormSection = lazy(() =>
    import("../components/post/PostFormSection")
)

const SocialLayout = () => {
    const [showCreatePostFormSection, setShowCreatePostFormSection] = useState<boolean>(false);
    const [isNotificationSidebarVisible, setIsNotificationSidebarVisible] = useState<boolean>(false);

    // register socket listener
    useEffect(() => {
        registerNotificationListeners();

        return () => {
            unregisterNotificationListeners();
        }
    }, [])

    return (
        <div className="w-full min-h-screen px-2 xl:px-10 2xl:px-40">
            {
                showCreatePostFormSection &&
                <Suspense fallback={<div className="w-screen h-screen fixed bg-black/80 top-0 left-0 z-20"></div>}>
                    <CreatePostFormSection setShowCreatePostFormSection={setShowCreatePostFormSection} />
                </Suspense>
            }
            <div className="w-full h-full grid lg:grid-cols-11 xl:grid-cols-12 gap-5 xl:gap-14 relative">
                {/* left sidebar */}
                <aside className="w-full h-screen col-span-1 xl:col-span-3 py-7 xl:py-10 sticky top-0">
                    <div className="w-full h-full px-3">
                        <Sidebar setShowCreatePropsSection={setShowCreatePostFormSection} setIsNotificationSidebarVisible={setIsNotificationSidebarVisible} isNotificationSidebarVisible={isNotificationSidebarVisible}/>
                    </div>

                    {/* notification */}
                    <div className={`hidden xl:inline-block h-screen bg-black py-10 absolute top-0 left-0 overflow-hidden z-30 ${isNotificationSidebarVisible ? "lg:w-72 xl:w-full opacity-100" : "opacity-0 w-0 touch-none"}`}>
                        <NotificationSidebar setIsNotificatoinSidebarVisible={setIsNotificationSidebarVisible} />
                    </div>
                </aside>

                {/* main */}
                <main className="col-span-6 xl:col-span-6">
                    <Outlet />
                </main>

                {/* right sidebar */}
                <div className="col-span-4 xl:col-span-3 h-screen sticky top-0 right-0 pt-10">  
                    {/* notification */}
                    <div className={`xl:hidden h-screen bg-black py-10 absolute top-0 left-0 overflow-hidden z-30 px-5 ${isNotificationSidebarVisible ? "w-full opacity-100" : "opacity-0 w-0 touch-none"}`}>
                        <NotificationSidebar setIsNotificatoinSidebarVisible={setIsNotificationSidebarVisible} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SocialLayout;