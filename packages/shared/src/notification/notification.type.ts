import { UserSummaryDTO } from "../user";
import { NotificationTargetType, NotificationType } from "./notification.const";

export type NotificationDTO = {
    id : string,
    actor : UserSummaryDTO,
    recepient : string,
    targetId : String,
    targetType : NotificationTargetType,
    type : NotificationType,
    isRead : boolean,
    createdAt : Date,
}