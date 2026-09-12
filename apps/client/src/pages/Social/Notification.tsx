import { useMutation } from "@tanstack/react-query";
import NotificationContainer from "../../components/notification/NotificationContainer";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { updateAllNotificationReadStatus } from "../../services/notification.service";
import useSetQueryDataHandler from "../../hooks/useSetQueryDataHandler";
import { notificationKeys } from "../../queries/notificationKeys";
import { markAllUnreadNotificationCacheAsRead, markAllUnreadNotificationCacheAsUnread } from "../../helpers/cache/notificationCache.helper";
import type { InfiniteQueryNotificationDTO } from "../../types/notification.type";
import { setUnreadCount } from "../../features/notification/notification.slice";
import { notify } from "../../helpers/notification/notify.helper";
import { lazy, Suspense } from "react";
import { useReportModal } from "../../providers/ReportModalProvider";
import { useSuspendModal } from "../../providers/SuspendModalProvider";

const ReportModal = lazy(() => import("../../components/modal/ReportModal"));
const SuspendModal = lazy(() => import("../../components/modal/SuspendModal"));

const Notification = () => {
    const unreadNotificationCount = useAppSelector(state => state.notification.unreadCount);
    const dispatch = useAppDispatch();
    const setQueryDataHandler = useSetQueryDataHandler();
    const unreadCount = useAppSelector(state => state.notification.unreadCount);
    const reportModal = useReportModal();
    const suspendModal = useSuspendModal();

    // mutation
    const notificationReadStatusMutation = useMutation({
        mutationFn: updateAllNotificationReadStatus,

        onMutate: () => {
            const prevUnreadCount = unreadNotificationCount;
            setQueryDataHandler<InfiniteQueryNotificationDTO>(notificationKeys.unread, markAllUnreadNotificationCacheAsRead);

            dispatch(setUnreadCount(0));

            return {
                prevUnreadCount,
            }
        },
        onError: (_error, _variables, context) => {
            setQueryDataHandler<InfiniteQueryNotificationDTO>(notificationKeys.unread, markAllUnreadNotificationCacheAsUnread)

            dispatch(setUnreadCount(context?.prevUnreadCount || 0));
        },
    });

    const handleReadAllNotification = async () => {
        if(notificationReadStatusMutation.isPending) return;

        try {
            await notificationReadStatusMutation.mutateAsync();
        } catch {
            notify.error({
                title: "Error",
                description: "Something went wrong.",
            });
        }
    }

    return (
        <>
            <title>
                Notification - Odiano
            </title>

            {
                reportModal.isOpen &&
                <Suspense fallback={<div className="w-full h-full fixed bg-black/50 top-0 left-0 z-26 flex items-center justify-center"></div>}>
                    <ReportModal/>
                </Suspense>
            }

            {
                suspendModal.isOpen &&
                <Suspense fallback={<div className="w-full h-full fixed bg-black/50 top-0 left-0 z-26 flex items-center justify-center"></div>}>
                    <SuspendModal/>
                </Suspense>
            }

            <div className="main-section-padding-top">
                <section className="flex items-center justify-between">
                    <h1 className="font-bold text-2xl">
                        Notifications
                    </h1>
                    {
                        unreadCount > 0 &&
                        <button className="text-sky-500 hover:text-sky-600 duration-100 text-sm cursor-pointer" onClick={handleReadAllNotification}>
                            Read all
                        </button>
                    }
                </section>
                <section className="mt-4 pb-10">
                    <NotificationContainer />
                </section>
            </div>
        </>
    )
}

export default Notification;