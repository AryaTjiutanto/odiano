import { model, Schema, Types } from "mongoose";
import { NotificationSchema } from "../types/notification.type";

const notificationSchema = new Schema<NotificationSchema>({
    recepient : {
        type : Types.ObjectId,
        ref : "User",
        required : true
    },
    isRead : {
        type : Boolean,
        default : false,
        index : true,
    },
    data : {
        type : Schema.Types.Mixed,
        required : true,
    },
    actor : {
        type : Types.ObjectId,
        ref : "User",
        required : false,
        default : null,
    },
}, {timestamps : true});

export const Notification = model('Notification', notificationSchema);