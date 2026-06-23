import { UserSummaryDTO } from "../user";
import { NotificationTargetType, NotificationType } from "./notification.const";

export type NotificationDTO = {
    actor : UserSummaryDTO,
    recepient : string,
    targetId : String,
    targetType : NotificationTargetType,
    type : NotificationType,
}