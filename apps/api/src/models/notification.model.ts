import { model, Schema, Types } from "mongoose";
import { boolean } from "zod";
import { NOTIFICATION_TARGET_TYPE, NOTIFICATION_TYPE, NotificationTargetType, NotificationType } from "../consts/notification.const";

type NotificationSchema = {
    recepient : Types.ObjectId,
    actor : Types.ObjectId,

    type : NotificationType,

    targetType : NotificationTargetType,
    targetId : Types.ObjectId,

    isRead : boolean
}

const notificationSchema = new Schema<NotificationSchema>({
    recepient : {
        type : Types.ObjectId,
        ref : "User",
        required : true
    },
    actor : {
        type : Types.ObjectId,
        ref : "User",
        required : true,
    },
    type : {
        type : String,
        enum : Object.values(NOTIFICATION_TYPE),
        required : true
    },
    targetType : {
        type : String,
        enum : Object.values(NOTIFICATION_TARGET_TYPE),
        required : true
    },
    targetId : {
        type : Types.ObjectId,
    },
    isRead : {
        type : Boolean,
        default : false,
    }
})

export const Notification = model('Notification', notificationSchema);