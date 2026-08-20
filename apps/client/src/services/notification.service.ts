import type { InfiniteQuery, NotificationDTO, NotificationReadStatus, SuccessResponseData } from "@odiano/shared";
import { api } from "../libs/api";

export const updateNotificationReadStatus = async (notificationId: string): Promise<boolean> => {
    const response = await api.put<SuccessResponseData>(`/notification/update/read-status/${notificationId}`);

    return response.data.success;
}

export const getNotifications = async (readStatus: NotificationReadStatus, pageParam: string | null) => {
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

export const updateAllNotificationReadStatus = async () => {
    await api.put<SuccessResponseData>("/notification/update/read-all");
}