import { NotificationDTO } from "@odiano/shared";
import { notificationQuery } from "../types/notification.type";

export const toNotificationDTO = (data : notificationQuery) : NotificationDTO => {
    return {
        id : data._id.toString(),
        actor : {
            id : data.actor._id.toString(),
            name : data.actor.name,
            profileImage : data.actor.profileImage,
            username : data.actor.username
        },
        createdAt : data.createdAt,
        isRead : data.isRead,
        recepient : data.recepient.toString(),
        targetId : data.targetId.toString(),
        targetType : data.targetType,
        type : data.type,
        ...(data.data && {
            data : data.data
        })
    }
}