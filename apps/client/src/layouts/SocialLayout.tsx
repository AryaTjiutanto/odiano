import { Outlet } from "react-router-dom";
import LeftSidebar from "../components/social/sidebar/LeftSidebar";
import { lazy, Suspense, useEffect } from "react";
import { registerNotificationListeners, unregisterNotificationListeners } from "../features/notification/notification.socket";
import { BottomNavigation } from "../components/social/BottomNavigation";
import { usePostForm } from "../providers/PostFormProvider";
import RightSidebar from "../components/social/sidebar/RightSidebar";
import { useAppDispatch } from "../hooks/useRedux";
import { getUnreadNotificationCount } from "../features/notification/notification.thunk";
import { useReportForm } from "../providers/ReportFormProvider";
import ModalSuspenseFallback from "../components/modal/SuspenseFallback";
import MobileHeader from "../components/social/MobileHeader";

const PostFormModal = lazy(() => import("../components/modal/PostFormModal"))

const ReportFormModal = lazy(() => import("../components/modal/ReportFormModal"));

const SocialLayout = () => {
    const dispatch = useAppDispatch();
    const postForm = usePostForm();
    const reportForm = useReportForm();

    // register socket listener
    useEffect(() => {
        dispatch(getUnreadNotificationCount());
        registerNotificationListeners();

        return () => {
            unregisterNotificationListeners();
        }
    }, [])

    return (
        <>
            <div className="w-full min-h-screen">
                <MobileHeader />

                <div className="px-5 sm:px-2 xl:px-10 2xl:px-40">
                    {
                        postForm.isOpen &&
                        <Suspense fallback={<ModalSuspenseFallback />}>
                            <PostFormModal />
                        </Suspense>
                    }
                    {
                        reportForm.isOpen &&
                        <Suspense fallback={<ModalSuspenseFallback />}>
                            <ReportFormModal />
                        </Suspense>
                    }

                    <div className="w-full h-full grid sm:grid-cols-16 md:grid-cols-10 lg:grid-cols-11 xl:grid-cols-15 2xl:grid-cols-11 gap-5 md:gap-6 lg:gap-10 xl:gap-14 relative">
                        {/* left sidebar */}
                        <aside className="hidden sm:inline-block w-full h-screen sm:col-span-2 md:col-span-1 xl:col-span-3 2xl:col-span-2 py-8 lg:py-7 xl:py-10 sticky top-0">
                            <div className="w-full h-full px-3">
                                <LeftSidebar />
                            </div>
                        </aside>

                        {/* main */}
                        <main className="sm:col-span-8 md:col-span-5 lg:col-span-6 xl:col-span-7 2xl:col-span-5 pb-16 sm:pb-0 min-w-0">
                            <Outlet />
                        </main>

                        {/* right sidebar */}
                        <div className="hidden sm:inline-block sm:col-span-6 md:col-span-4 lg:col-span-4 xl:col-span-4 2xl:col-span-3 h-screen sticky top-0 right-0 pt-5 lg:pt-6 xl:pt-8 2xl:pl-20 md:pr-5 lg:pr-10 xl:pr-0">
                            <RightSidebar />
                        </div>
                    </div>


                    {/* bottom navigation */}
                    <BottomNavigation />
                </div>
            </div>
        </>
    )
}

export default SocialLayout;