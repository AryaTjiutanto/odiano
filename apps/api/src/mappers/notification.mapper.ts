import { NotificationDTO } from "@odiano/shared";
import { NotificationQuery } from "../types/notification.type";
import { toUserSummaryDTO } from "./user.mapper";

export const toNotificationDTO = (data: NotificationQuery): NotificationDTO => {
    const notificationData = data.data;

    return {
        id: data._id.toString(),
        recepient: data.recepient.toString(),
        isRead: data.isRead,
        data: ("actor" in notificationData) ? {
            ...notificationData,
            actor : toUserSummaryDTO(notificationData.actor),
        } : notificationData,
        createdAt : data.createdAt,
    }
}