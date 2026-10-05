import { Types } from "mongoose";
import { UserSummaryQuery } from "./user.type.js";
import { Notification } from "@odiano/shared";

export type NotificationSchema = Omit<Notification, "recepient"> & {
    recepient: Types.ObjectId,
    actor: Types.ObjectId | null,
}

export type NotificationQuery = Notification & {
    _id : Types.ObjectId,
    actor : UserSummaryQuery | null
}