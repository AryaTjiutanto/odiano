import { NOTIFICATION_TARGET_TYPE, NOTIFICATION_TYPE, NotificationTargetType, NotificationType, NotificationData, NotificationPostData } from "@odiano/shared";
import { model, Schema, Types } from "mongoose";

type NotificationSchema = {
    recepient : Types.ObjectId,
    actor : Types.ObjectId,

    type : NotificationType,

    targetType : NotificationTargetType,
    targetId : Types.ObjectId,

    data? : NotificationData,

    isRead : boolean,
}

const notificationPostDataSchema = new Schema<NotificationPostData>({
    id : {
        type : String,
        required : true,
    },
    publicId : {
        type : String,
        required : true,
    },
    content : {
        type : String,
        required : true,
    },
    firstMedia : {
        url : {
            type : String,
            required : false,
        },
        publicId : {
            type : String,
            required : false,
        }
    }
})

const notificationDataSchema = new Schema<NotificationData>({
    message : {
        type : String,
        required : false,
    },
    post : {
        type : notificationPostDataSchema,
        required : true,
    }
})

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
        required : true,
        index : true,
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
        index : true,
    },
    data : {
        type : notificationDataSchema,
        required : false,
    }
}, {timestamps : true});

export const Notification = model('Notification', notificationSchema);