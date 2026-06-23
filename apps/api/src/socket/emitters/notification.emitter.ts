import { UserSummaryDTO } from "@connect/shared";
import { getIo } from ".."
import { NotificationTargetType, NotificationType } from "../../consts/notification.const";

export type NotificationDTO = {
    actor : UserSummaryDTO,
    recepient : string,
    targetId : String,
    targetType : NotificationTargetType,
    type : NotificationType,
}

export const emitToUser = (notificaton : NotificationDTO, userId : string) => {
    const io = getIo();

    io.to(`user:${userId}`).emit(`notification:new`, notificaton);
}