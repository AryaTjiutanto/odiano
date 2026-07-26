import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import { lazy, Suspense, useEffect } from "react";
import NotificationSection from "../components/sidebar/NotificationSection";
import { registerNotificationListeners, unregisterNotificationListeners } from "../features/notification/notification.socket";
import { BottomNavigation } from "../components/social/BottomNavigation";
import { usePostForm } from "../providers/PostFormProvider";
import { useNotificationSection } from "../providers/NotificationSectionProvider";

const PostFormSection = lazy(() =>
    import("../components/post/PostFormSection")
)

const SocialLayout = () => {
    const postForm = usePostForm();
    const notificationSection = useNotificationSection();

    // register socket listener
    useEffect(() => {
        registerNotificationListeners();

        return () => {
            unregisterNotificationListeners();
        }
    }, [])

    return (
        <>
            <div className="w-full min-h-screen px-5 sm:px-2 xl:px-10 2xl:px-40">
                {
                    postForm.isOpen &&
                    <Suspense fallback={<div className="w-screen h-screen fixed bg-black/80 top-0 left-0 z-20"></div>}>
                        <PostFormSection/>
                    </Suspense>
                }

                <div className="w-full h-full grid sm:grid-cols-16 md:grid-cols-10 lg:grid-cols-11 xl:grid-cols-12 2xl:grid-cols-11 gap-5 xl:gap-14 relative">
                    {/* left sidebar */}
                    <aside className="hidden sm:inline-block w-full h-screen sm:col-span-2 md:col-span-1 xl:col-span-3 py-8 lg:py-7 xl:py-10 sticky top-0">
                        <div className="w-full h-full px-3">
                            <Sidebar/>
                        </div>

                        {/* notification */}
                        <div className={`hidden xl:inline-block h-screen bg-black py-10 absolute top-0 left-0 overflow-hidden z-30 ${notificationSection.isOpen ? "lg:w-72 xl:w-full opacity-100" : "opacity-0 w-0 touch-none"}`}>
                            <NotificationSection/>
                        </div>
                    </aside>

                    {/* main */}
                    <main className="sm:col-span-8 md:col-span-5 lg:col-span-6 2xl:col-span-5 pb-16 sm:pb-0">
                        <Outlet />

                        {/* notification Section */}
                        <div className={`w-full h-screen sm:hidden fixed top-0 left-0 bg-black z-24 ${notificationSection.isOpen ? "w-full opacity-100" : "opacity-0 w-0 touch-none hidden"}`}>
                            <NotificationSection hasCloseButton={false}/>
                        </div>
                    </main>

                    {/* right sidebar */}
                    <div className="hidden sm:inline-block sm:col-span-6 md:col-span-4 xl:col-span-3 h-screen sticky top-0 right-0 pt-10">  
                        {/* notification */}
                        <div className={`xl:hidden h-screen bg-black py-10 absolute top-0 left-0 overflow-hidden z-30 xl:px-5 ${notificationSection.isOpen ? "w-full opacity-100" : "opacity-0 w-0 touch-none"}`}>
                            <NotificationSection/>
                        </div>
                    </div>
                </div>


                {/* bottom navigation */}
                <BottomNavigation/>
            </div>
        </>
    )
}

export default SocialLayout;