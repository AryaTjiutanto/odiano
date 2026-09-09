import { Types } from "mongoose";
import { CommentOnYourPostData, FollowYouData, LikeYourPostData, YourPostSuspendedData, YourReportResolvedData } from "@odiano/shared";
import { UserSummaryQuery } from "./user.type";

// ============================  notification schema
// notification data schema
type CommentOnYourPostDataSchema = Omit<CommentOnYourPostData, "actor"> & {
    actor: Types.ObjectId,
}

type LikeYourPostDataSchema = Omit<LikeYourPostData, "actor"> & {
    actor: Types.ObjectId,
}

type FollowYouDataSchema = Omit<FollowYouData, "actor"> & {
    actor: Types.ObjectId,
}

export type NotificationDataSchema = CommentOnYourPostDataSchema | LikeYourPostDataSchema | FollowYouDataSchema | YourPostSuspendedData | YourReportResolvedData

// notification schema
export type NotificationSchema = {
    recepient: Types.ObjectId,
    isRead: boolean,
    data: NotificationDataSchema,
}

// ============================  notification query
// notification data
type CommentOnYourPostDataQuery = Omit<CommentOnYourPostData, "actor"> & {
    actor: UserSummaryQuery,
}

type LikeYourPostDataQuery = Omit<LikeYourPostData, "actor"> & {
    actor: UserSummaryQuery,
}

type FollowYouDataQuery = Omit<FollowYouData, "actor"> & {
    actor: UserSummaryQuery,
}

export type NotificationDataQuery = CommentOnYourPostDataQuery | LikeYourPostDataQuery | FollowYouDataQuery | YourPostSuspendedData | YourReportResolvedData

// query
export type NotificationQuery = Omit<NotificationSchema, "data"> & {
    _id: Types.ObjectId,
    data: NotificationDataQuery,
    createdAt : Date,
}