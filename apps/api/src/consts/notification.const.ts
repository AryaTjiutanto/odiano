import { Types } from "mongoose";
import { UserSummaryQuery } from "../types/user.type";
import { NotificationTargetType, NotificationType } from "@odiano/shared";

export const NOTIFICATION_PAGE_SIZE = 15 as const;

export type notificationQuery = {
    _id : Types.ObjectId,
    recepient : Types.ObjectId,
    actor : UserSummaryQuery,
    type : NotificationType,
    targetType : NotificationTargetType,
    targetId : Types.ObjectId,
    isRead : boolean,
    createdAt : Date,
};