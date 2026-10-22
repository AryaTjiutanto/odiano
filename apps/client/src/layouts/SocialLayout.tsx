import LeftSidebar from "../components/social/sidebar/LeftSidebar";
import { lazy, Suspense, useEffect, useRef, type ReactNode } from "react";
import { registerNotificationListeners, unregisterNotificationListeners } from "../features/notification/notification.socket";
import { BottomNavigation } from "../components/social/BottomNavigation";
import { usePostForm } from "../providers/PostFormProvider";
import { useAppDispatch } from "../hooks/useRedux";
import { getUnreadNotificationCount } from "../features/notification/notification.thunk";
import { useReportForm } from "../providers/ReportFormProvider";
import ModalSuspenseFallback from "../components/modal/SuspenseFallback";
import MobileHeader from "../components/social/MobileHeader";
import { useLocation } from "react-router-dom";

const PostFormModal = lazy(() => import("../components/modal/PostFormModal"))

const ReportFormModal = lazy(() => import("../components/modal/ReportFormModal"));

const SocialLayout = ({children} : {children : ReactNode}) => {
    const {isOpen} = usePostForm();
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
    }, [dispatch])

    // window scroll
    const location = useLocation();
    const layout = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log(location.pathname, layout.current?.scrollHeight);
    }, [location])

    return (
        <>
            <div className={`w-full ${isOpen ? "overflow-y-hidden" : ""}`} ref={layout} onClick={() => console.log(layout.current?.scrollTop, window.scrollY)}>
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

                    <div className="w-full h-full grid sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-11 xl:grid-cols-5 2xl:grid-cols-11 gap-5 md:gap-6 lg:gap-10 xl:gap-14 relative">
                        {/* left sidebar */}
                        <aside className="hidden sm:inline-block w-full h-screen sm:col-span-1 xl:col-span-1 2xl:col-span-2 py-8 lg:py-7 xl:py-10 sticky top-0">
                            <div className="w-full h-full px-3">
                                <LeftSidebar />
                            </div>
                        </aside>

                        {/* main */}
                        <main className="sm:col-span-7 md:col-span-9 llg:col-span-10 xl:col-span-4 2xl:col-span-9 pb-16 sm:pb-0 min-w-0">
                            {children}
                        </main>
                    </div>


                    {/* bottom navigation */}
                    <BottomNavigation />
                </div>
            </div>
        </>
    )
}

export default SocialLayout;