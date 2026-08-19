import { NOTIFICATION_TARGET_TYPE, NOTIFICATION_TYPE, NotificationTargetType, NotificationType, NotificationData, NotificationPostData, MEDIA_ASPECT_RATIO, NotificationCommentData } from "@odiano/shared";
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
        required : false,
    },
    firstMedia : {
        aspectRatio : {
            type : String,
            enum : Object.values(MEDIA_ASPECT_RATIO),
            required : false,
        },
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

const notificationCommentDataSchema = new Schema<NotificationCommentData>({
    id : {
        type : String,
        required : true,
    },
    message : {
        type : String,
        required : true,
    }
})

const notificationDataSchema = new Schema<NotificationData>({
    comment: {
        type : notificationCommentDataSchema,
        required : false,
    },
    post : {
        type : notificationPostDataSchema,
        required : false,
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