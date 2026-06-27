import type { InfiniteQuery, NotificationDTO } from "@connect/shared";
import { socket } from "../../libs/socket"
import { queryClient } from "../../libs/react-query/queryClient";
import type { InfiniteData } from "@tanstack/react-query";
import { NOTIFICATION_KEY } from "../../consts/notification.const";

export const registerNotificationListeners = () => {
    socket.on("notification:new", (notification: NotificationDTO) => {
        queryClient.setQueryData(NOTIFICATION_KEY.UNREAD, (oldData : InfiniteData<InfiniteQuery<NotificationDTO[]>>) => {
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
    })
}

export const unregisterNotificationListeners = () => {
    socket.off("notification:new");
}