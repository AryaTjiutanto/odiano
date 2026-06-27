import { NOTIFICATION_TYPE, type InfiniteQuery, type NotificationDTO, type SuccessResponseData } from "@connect/shared";
import { useInfiniteQuery, useMutation, type InfiniteData, type QueryFunctionContext } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import NotificationSkeletonLoading from "./NotificationSkeletonLoading";
import { useAppSelector } from "../../shared/hooks/useRedux";
import CommentOnYourPostNotification from "./types/CommentOnYourPostNotification";
import FollowYouNotification from "./types/FollowYouNotification";
import useSetQueryDataHandler from "../../hooks/useSetQueryDataHandler";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Notifications = () => {
    const isAuth = useAppSelector((state) => state.auth.isAuthenticated);
    const setQueryDataHandler = useSetQueryDataHandler();

    const navigate = useNavigate();

    // get notifications
    const notificationQueryKey = ['notification'];

    const getNotifications = async ({ pageParam }: QueryFunctionContext): Promise<InfiniteQuery<NotificationDTO[]>> => {
        const response = await api.get<SuccessResponseData<InfiniteQuery<NotificationDTO[]>>>(`/notification`, {
            params: {
                cursor: pageParam
            }
        });

        if (!response.data.data) {
            throw new Error("Notification is empty");
        }

        return response.data.data;
    }

    const notificationQuery = useInfiniteQuery({
        queryFn: getNotifications,
        queryKey: notificationQueryKey,
        staleTime: 30 * 1000,
        gcTime: DEFAULT_GC_TIME,
        initialPageParam: null,
        enabled: isAuth,
        getNextPageParam: (lastPage: InfiniteQuery<NotificationDTO[]>) => {
            return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
        },
    })

    // mutation
    const updateNotificationReadStatus = async (notificationId: string): Promise<boolean> => {
        await api.put<SuccessResponseData>(`/notification/update/read-status/${notificationId}`);

        return true;
    }

    const notificationReadStatusMutation = useMutation({
        mutationFn: updateNotificationReadStatus,

        onMutate: (notificationId: string) => setQueryDataHandler<InfiniteData<InfiniteQuery<NotificationDTO[]>>>(notificationQueryKey, (oldData) => {
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

        onError: (notificationId: string) => setQueryDataHandler<InfiniteData<InfiniteQuery<NotificationDTO[]>>>(notificationQueryKey, (oldData) => {
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

    const handleUpdateReadStatus = async (item : NotificationDTO) => {
        switch (item.type) {
            case NOTIFICATION_TYPE.FOLLOW_YOU : 
                navigate(`/profile/${item.actor.username}`);
                break;
        }

        if(!item.isRead) {
            await notificationReadStatusMutation.mutateAsync(item.id);
        }
    }

    // display the data
    if (notificationQuery.isPending) {
        return (
            <div className="w-full space-y-4">
                {
                    Array.from({ length: 5 }).map((_, index) => <NotificationSkeletonLoading key={`notification-${index}`} />)
                }
            </div>
        )
    }

    if (!notificationQuery.isPending && notificationQuery.data && notificationQuery.data.pages[0].items.length > 0) {
        return (
            <div className="w-full space-y-2">
                {notificationQuery.data.pages.map((page) => page.items.map(item => {
                    return (
                        <article className={`w-full ${!item.isRead && 'bg-neutral-800'} rounded-xl px-3 cursor-pointer`} onClick={() => handleUpdateReadStatus(item)}>
                            {
                                (item.type == NOTIFICATION_TYPE.COMMENT_ON_YOUR_COMMENT) &&
                                <CommentOnYourPostNotification item={item} />
                            }
                            {
                                item.type == NOTIFICATION_TYPE.FOLLOW_YOU &&
                                <FollowYouNotification item={item} />
                            }
                        </article>
                    )
                }
                ))}
            </div>
        )
    }

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

export default Notifications;