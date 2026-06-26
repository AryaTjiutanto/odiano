import { NOTIFICATION_TYPE, type InfiniteQuery, type NotificationDTO, type SuccessResponseData } from "@connect/shared";
import { useInfiniteQuery, type QueryFunctionContext } from "@tanstack/react-query";
import { api } from "../../libs/api";
import { DEFAULT_GC_TIME } from "../../consts/queryTime.const";
import NotificationSkeletonLoading from "./NotificationSkeletonLoading";
import { useAppSelector } from "../../shared/hooks/useRedux";
import CommentOnYourPostNotification from "./types/CommentOnYourPostNotification";

const Notifications = () => {
    const isAuth = useAppSelector((state) => state.auth.isAuthenticated);

    // get notifications
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
        queryKey: ['notification'],
        staleTime: 30 * 1000,
        gcTime: DEFAULT_GC_TIME,
        initialPageParam: null,
        enabled: isAuth,
        getNextPageParam: (lastPage: InfiniteQuery<NotificationDTO[]>) => {
            return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
        },
    })

    // display the data
    if (notificationQuery.isPending) {
        return (
            <div className="w-full space-y-4">
                {
                    Array.from({ length: 5 }).map((notification, index) => <NotificationSkeletonLoading key={`notification-${index}`} />)
                }
            </div>
        )
    }

    if (!notificationQuery.isPending && notificationQuery.data) {
        return (
            <div className="w-full space-y-5">
                {notificationQuery.data.pages.map((page) => page.items.map(item => {
                    if (item.type == NOTIFICATION_TYPE.COMMENT_ON_YOUR_POST) {
                        return (
                            <CommentOnYourPostNotification item={item}/>
                        )
                    }
                }
                ))}
            </div>
        )
    }

    return (
        <div className="w-full text-center text-left">
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