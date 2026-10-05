import { NotificationDTO } from "@odiano/shared";
import { NotificationQuery } from "../types/notification.type.js";
import { toUserSummaryDTO } from "./user.mapper.js";

export const toNotificationDTO = (data: NotificationQuery): NotificationDTO => {
    const notificationData = data.data;

    return {
        id: data._id.toString(),
        recepient: data.recepient.toString(),
        isRead: data.isRead,
        data: notificationData,
        actor: data.actor ? toUserSummaryDTO(data.actor) : null,
        createdAt: data.createdAt,
    }
}