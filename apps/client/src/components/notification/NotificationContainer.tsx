import { NOTIFICATION_READ_STATUS, NOTIFICATION_TYPE, type InfiniteQuery, type NotificationDTO } from "@odiano/shared";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import NotificationSkeletonLoading from "./NotificationSkeletonLoading";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import useSetQueryDataHandler from "../../hooks/useSetQueryDataHandler";
import { useNavigate } from "react-router-dom";
import { notificationKeys } from "../../queries/notificationKeys";
import Notifications from "./Notifications";
import { getNotifications, updateNotificationReadStatus } from "../../services/notification.service";
import { markNotificationAsRead, markNotificationAsUnread } from "../../helpers/cache/notificationCache.helper";
import type { InfiniteQueryNotificationDTO } from "../../types/notification.type";
import { decrementUnreadCount } from "../../features/notification/notification.slice";

const NotificationContainer = () => {
    const username = useAppSelector((state) => state.auth.user?.username);
    const isAuth = useAppSelector((state) => state.auth.isAuthenticated);
    const setQueryDataHandler = useSetQueryDataHandler();
    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    // get read notifications
    const readNotificationQuery = useInfiniteQuery({
        queryFn: ({pageParam}) => getNotifications(NOTIFICATION_READ_STATUS.READ, pageParam),
        queryKey: notificationKeys.read,
        staleTime: 30 * 1000,
        gcTime: DEFAULT_GC_TIME,
        initialPageParam: null,
        enabled: isAuth,
        getNextPageParam: (lastPage: InfiniteQuery<NotificationDTO[]>) => {
            return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
        },
    })

    // get unread notifications
    const unreadNotificationQuery = useInfiniteQuery({
        queryFn: ({pageParam}) => getNotifications(NOTIFICATION_READ_STATUS.UNREAD, pageParam),
        queryKey: notificationKeys.unread,
        staleTime: 30 * 1000,
        gcTime: DEFAULT_GC_TIME,
        initialPageParam: null,
        enabled: isAuth,
        getNextPageParam: (lastPage: InfiniteQuery<NotificationDTO[]>) => {
            return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
        },
    });

    // mutation
    const notificationReadStatusMutation = useMutation({
        mutationFn: updateNotificationReadStatus,

        onMutate: (notificationId: string) => setQueryDataHandler<InfiniteQueryNotificationDTO>(notificationKeys.unread, (oldData) => markNotificationAsRead(oldData, notificationId)),

        onError: (notificationId: string) => setQueryDataHandler<InfiniteQueryNotificationDTO>(notificationKeys.unread, (oldData) => markNotificationAsUnread(oldData, notificationId)),
    })

    const handleUpdateReadStatus = async (item: NotificationDTO) => {
        switch (item.data.type) {
            case NOTIFICATION_TYPE.FOLLOW_YOU:
                navigate(`/profile/${item.data.actor.username}`);
                break;
            case NOTIFICATION_TYPE.LIKE_YOUR_POST:
                if(!item.data?.target) {
                    break;
                }

                navigate(`/${username}/post/${item.data.target.publicId}`);   
                break;
            case NOTIFICATION_TYPE.COMMENT_ON_YOUR_POST:
                if(!item.data?.target.comment?.id || !item.data?.target.post) {
                    break;
                }

                const queryParams = new URLSearchParams({
                    commentId: item.data.target.comment.id,
                });

                navigate(`/${username}/post/${item.data.target.post.publicId}?${queryParams.toString()}`);
        }

        if (!item.isRead) {
            await notificationReadStatusMutation.mutateAsync(item.id);
            dispatch(decrementUnreadCount());
        }
    }

    // display the data
    if (unreadNotificationQuery.isPending || readNotificationQuery.isPending) {
        return (
            <div className="w-full space-y-4">
                {
                    Array.from({ length: 5 }).map((_, index) => <NotificationSkeletonLoading key={`notification-${index}`} />)
                }
            </div>
        )
    }

    if(!(unreadNotificationQuery.data && unreadNotificationQuery.data.pages[0].items.length > 0) && !(readNotificationQuery.data && readNotificationQuery.data.pages[0].items.length > 0)) {
        return (
            <div className="w-full text-center h-50 p-6 border border-dashed border-neutral-500 rounded-lg flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-neutral-300">
                    There are no notifications yet.
                </h1>
                <h2 className="mt-2 text-neutral-400">
                    When you receive notifications, they'll appear here.
                </h2>
            </div>
        )
    }

    return <div className="w-full space-y-2">
        {/* unread notification */}
        <Notifications data={unreadNotificationQuery.data} fetchNextPage={unreadNotificationQuery.fetchNextPage} handleUpdateReadStatus={handleUpdateReadStatus} hasNextPage={unreadNotificationQuery.hasNextPage} isFetchingNextPage={unreadNotificationQuery.isFetchingNextPage} />
        {/* read notification */}
        <Notifications data={readNotificationQuery.data} fetchNextPage={readNotificationQuery.fetchNextPage} handleUpdateReadStatus={handleUpdateReadStatus} hasNextPage={readNotificationQuery.hasNextPage} isFetchingNextPage={readNotificationQuery.isFetchingNextPage} />
    </div>

}

export default NotificationContainer;