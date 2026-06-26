import type { InfiniteQuery, NotificationDTO } from "@connect/shared";
import { socket } from "../../libs/socket"
import { queryClient } from "../../libs/react-query/queryClient";
import type { InfiniteData } from "@tanstack/react-query";

export const registerNotificationListeners = () => {
    socket.on("notification:new", (notification: NotificationDTO) => {
        queryClient.setQueryData(['notification'], (oldData : InfiniteData<InfiniteQuery<NotificationDTO[]>>) => {
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