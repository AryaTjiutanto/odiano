import { NotificationTargetType, NotificationType } from "../consts/notification.const"
import { Notification } from "../models/notification.model"
import { emitToUser, NotificationDTO } from "../socket/emitters/notification.emitter";
import { getUserSummary } from "./user.service";

type createNotificationParams = {
    recepient : string,
    targetId : string,
    targetType : NotificationTargetType,
    type : NotificationType,
}

export const create = async (currentUserId : string, params : createNotificationParams) => {
    const notification = await Notification.create({
        actor : currentUserId,
        recepient : params.recepient,
        targetId : params.targetId,
        targetType : params.targetType,
        type : params.type,
    });

    // get user summary
    let userSummary;
    userSummary = await getUserSummary(currentUserId).catch(() => null);

    if(!userSummary) return;

    // emit to user
    const notificationDTO : NotificationDTO = {
        actor : userSummary,
        recepient : params.recepient,
        targetId : params.targetId,
        targetType : params.targetType,
        type : params.type,
    };

    emitToUser(notificationDTO, currentUserId);
}