import { NOTIFICATION_READ_STATUS, NOTIFICATION_TYPE, type InfiniteQuery, type NotificationDTO, type NotificationReadStatus, type SuccessResponseData } from "@odiano/shared";
import { useInfiniteQuery, useMutation, type InfiniteData, type QueryFunctionContext } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import NotificationSkeletonLoading from "./NotificationSkeletonLoading";
import { useAppSelector } from "../../hooks/useRedux";
import useSetQueryDataHandler from "../../hooks/useSetQueryDataHandler";
import { useNavigate } from "react-router-dom";
import { NOTIFICATION_KEY, type NotificationKey } from "../../consts/notification.const";
import Notification from "./Notification";

const Notifications = () => {
    const isAuth = useAppSelector((state) => state.auth.isAuthenticated);
    const setQueryDataHandler = useSetQueryDataHandler();

    const navigate = useNavigate();

    // get notification functions
    const createNotificationQueryFn = (readStatus: NotificationReadStatus) => {
        return async ({ pageParam }: QueryFunctionContext): Promise<InfiniteQuery<NotificationDTO[]>> => {
            const response = await api.get<SuccessResponseData<InfiniteQuery<NotificationDTO[]>>>(`/notification`, {
                params: {
                    cursor: pageParam,
                    readStatus: readStatus,
                }
            });

            if (!response.data.data) {
                throw new Error("Notification is empty");
            }

            return response.data.data;
        }
    }

    const notificationsInfiniteQueryFactory = (notificationKey: NotificationKey, fn: (data: QueryFunctionContext) => any) => useInfiniteQuery({
        queryFn: fn,
        queryKey: notificationKey,
        staleTime: 30 * 1000,
        gcTime: DEFAULT_GC_TIME,
        initialPageParam: null,
        enabled: isAuth,
        getNextPageParam: (lastPage: InfiniteQuery<NotificationDTO[]>) => {
            return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
        },
    });

    // get read notifications
    const getReadNotifications = createNotificationQueryFn(NOTIFICATION_READ_STATUS.READ);
    const readNotificationQuery = notificationsInfiniteQueryFactory(NOTIFICATION_KEY.READ, getReadNotifications);

    // get unread notifications
    const getUnreadNotifications = createNotificationQueryFn(NOTIFICATION_READ_STATUS.UNREAD);
    const unreadNotificationQuery = notificationsInfiniteQueryFactory(NOTIFICATION_KEY.UNREAD, getUnreadNotifications);

    // mutation
    const updateNotificationReadStatus = async (notificationId: string): Promise<boolean> => {
        await api.put<SuccessResponseData>(`/notification/update/read-status/${notificationId}`);

        return true;
    }

    const notificationReadStatusMutation = useMutation({
        mutationFn: updateNotificationReadStatus,

        onMutate: (notificationId: string) => setQueryDataHandler<InfiniteData<InfiniteQuery<NotificationDTO[]>>>(NOTIFICATION_KEY.UNREAD, (oldData) => {
            return {
                ...oldData,
                pageParams: oldData.pageParams,
                pages: oldData.pages.map((page) => ({
                    ...page,
                    items: page.items.map(item => {
                        return item.id == notificationId ?
                            {
                                ...item,
                                isRead: true,
                            } : item
                    })
                }))
            }
        }),

        onError: (notificationId: string) => setQueryDataHandler<InfiniteData<InfiniteQuery<NotificationDTO[]>>>(NOTIFICATION_KEY.UNREAD, (oldData) => {
            return {
                ...oldData,
                pageParams: oldData.pageParams,
                pages: oldData.pages.map((page) => ({
                    ...page,
                    items: page.items.map(item => {
                        return item.id == notificationId ?
                            {
                                ...item,
                                isRead: false,
                            } : item
                    })
                }))
            }
        })
    })

    const handleUpdateReadStatus = async (item: NotificationDTO) => {
        switch (item.type) {
            case NOTIFICATION_TYPE.FOLLOW_YOU:
                navigate(`/profile/${item.actor.username}`);
                break;
        }

        if (!item.isRead) {
            await notificationReadStatusMutation.mutateAsync(item.id);
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
            <div className="w-full text-left px-3">
                <h1 className="text-2xl font-bold">
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
        <Notification data={unreadNotificationQuery.data} fetchNextPage={unreadNotificationQuery.fetchNextPage} handleUpdateReadStatus={handleUpdateReadStatus} hasNextPage={unreadNotificationQuery.hasNextPage} isFetchingNextPage={unreadNotificationQuery.isFetchingNextPage} />
        {/* read notification */}
        <Notification data={readNotificationQuery.data} fetchNextPage={readNotificationQuery.fetchNextPage} handleUpdateReadStatus={handleUpdateReadStatus} hasNextPage={readNotificationQuery.hasNextPage} isFetchingNextPage={readNotificationQuery.isFetchingNextPage} />
    </div>

}

export default Notifications;