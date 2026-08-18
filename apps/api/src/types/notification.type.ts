import { Types } from "mongoose";
import { UserSummaryQuery } from "./user.type";
import { NotificationData, NotificationTargetType, NotificationType } from "@odiano/shared";

export type notificationQuery = {
    _id : Types.ObjectId,
    recepient : Types.ObjectId,
    actor : UserSummaryQuery,
    type : NotificationType,
    targetType : NotificationTargetType,
    targetId : Types.ObjectId,
    isRead : boolean,
    createdAt : Date,
    data? : NotificationData,
};