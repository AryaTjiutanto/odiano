import { NotificationDTO } from "@connect/shared";
import { notificationQuery } from "../consts/notification.const";

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
    }
}