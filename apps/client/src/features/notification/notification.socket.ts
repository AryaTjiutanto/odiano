import type { InfiniteQuery, NotificationDTO } from "@odiano/shared";
import { socket } from "../../libs/socket"
import { queryClient } from "../../libs/react-query/queryClient";
import type { InfiniteData } from "@tanstack/react-query";
import { notificationKeys } from "../../queries/notificationKeys";
import { incrementUnreadCount } from "./notification.slice";
import { store } from "../../app/store";

export const registerNotificationListeners = () => {
    socket.on("notification:new", (notification: NotificationDTO) => {
        queryClient.setQueryData(notificationKeys.unread, (oldData : InfiniteData<InfiniteQuery<NotificationDTO[]>>) => {
            if(!oldData) return oldData;

            return {
                ...oldData,
                pages : [
                    {
                        ...oldData.pages[0],
                        items : [
                            notification,
                            ...oldData.pages[0].items,
                        ]
                    },
                    ...oldData.pages.slice(1),
                ],
                pageParams : oldData.pageParams
            }
        })

        store.dispatch(incrementUnreadCount());
    })
}

export const unregisterNotificationListeners = () => {
    socket.off("notification:new");
}