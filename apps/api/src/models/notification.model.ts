import { model, Schema, Types } from "mongoose";
import { boolean } from "zod";

type NotificationSchema = {
    recepientId : Types.ObjectId,
    ownerId : Types.ObjectId,

    type : "comment" | "post" | "follow",

    targetType : "post" | "follow",
    targetId : Types.ObjectId,

    isRead : boolean
}

const notificationSchema = new Schema<NotificationSchema>({
    recepientId : {
        type : Types.ObjectId,
        ref : "User",
        required : true
    },
    ownerId : {
        type : Types.ObjectId,
        ref : "User",
        required : true,
    },
    type : {
        type : String,
        enum : ["comment", "post", "follow"],
        required : true
    },
    targetType : {
        type : String,
        enum : ["post", "follow"],
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