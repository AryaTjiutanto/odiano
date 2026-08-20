import type { NotificationDTO } from "@odiano/shared";
import { socket } from "../../libs/socket"
import { queryClient } from "../../libs/react-query/queryClient";
import { notificationKeys } from "../../queries/notificationKeys";
import { incrementUnreadCount } from "./notification.slice";
import { store } from "../../app/store";
import type { InfiniteQueryNotificationDTO } from "../../types/notification.type";

export const registerNotificationListeners = () => {
    socket.on("notification:new", (notification: NotificationDTO) => {
        queryClient.setQueryData(notificationKeys.unread, (oldData : InfiniteQueryNotificationDTO) => {
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