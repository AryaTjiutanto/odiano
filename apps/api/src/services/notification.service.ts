import { InfiniteQuery, NotificationData, NotificationDTO, NotificationTargetType, NotificationType } from "@odiano/shared";
import { Notification } from "../models/notification.model"
import { emitToUser } from "../socket/emitters/notification.emitter";
import { getUserSummary } from "./user.service";
import { NOTIFICATION_PAGE_SIZE } from "../consts/notification.const";
import { toNotificationDTO } from "../mappers/notification.mapper";
import { nanoid } from "nanoid";
import { UnauthorizedError } from "../errors/unauthorized.error";
import mongoose, { ClientSession } from "mongoose";
import { notificationQuery } from "../types/notification.type";

type createNotificationParams = {
    recepientId: string,
    targetId: string,
    targetType: NotificationTargetType,
    type: NotificationType,
    data?: NotificationData,
}

export const get = async (currentUserId: string, cursor: string | undefined | null, isRead: boolean): Promise<InfiniteQuery<NotificationDTO[]>> => {
    // get notifications
    let notifications = await Notification.find({
        recepient: currentUserId,
        isRead,
        ...(cursor && {
            _id: mongoose.trusted({
                $lt: cursor
            })
        })
    })
        .sort({ _id: -1 })
        .select("_id recepient type targetType targetId isRead createdAt data")
        .populate("actor", "_id name username profileImage")
        .limit(NOTIFICATION_PAGE_SIZE + 1)
        .lean<notificationQuery[]>();

    // organize the data
    let hasNextPage = notifications.length > NOTIFICATION_PAGE_SIZE;

    if (hasNextPage) {
        notifications = notifications.splice(0, NOTIFICATION_PAGE_SIZE);
    }

    const items = notifications.map(toNotificationDTO);

    return {
        hasNextPage,
        items: items,
        nextCursor: hasNextPage ? items[items.length - 1].id : null,
    };
}

export const updateReadStatus = async (currentUserId: string, notificationId: string) => {
    // get and check notification
    const notification = await Notification.findOne({ recepient: currentUserId, _id: notificationId });

    if (!notification) {
        throw new UnauthorizedError();
    }

    // update
    notification.isRead = true;
    notification.save();
}

export const create = async (authorId: string, params: createNotificationParams, session?: ClientSession) => {
    await Notification.create([
        {
            actor: authorId,
            recepient: params.recepientId,
            targetId: params.targetId,
            targetType: params.targetType,
            type: params.type,
            ...(params.data && { data: params.data }),
        }
    ], { session });

    // get user summary
    let userSummary;
    userSummary = await getUserSummary(authorId).catch(() => null);

    if (!userSummary) return;

    // emit to user
    const notificationDTO: NotificationDTO = {
        id: String(nanoid(6)),
        actor: userSummary,
        recepient: params.recepientId,
        targetId: params.targetId,
        targetType: params.targetType,
        type: params.type,
        isRead: false,
        createdAt: new Date,
        ...(params.data && { data: params.data }),
    };

    emitToUser(notificationDTO, params.recepientId);
}

export const getUnreadCount = async (currentUserId: string) : Promise<number> => {
    // get unread notifications count
    const unreadCount = await Notification.countDocuments({
        recepient: currentUserId,
        isRead: false,
    });

    return unreadCount;
}

export const deleteNotificationWithRecepient = async (recepient: string, type?: NotificationType, session? : ClientSession) => {
    await Notification.deleteMany({
        recepient,
        ...(type && { type })
    }, {session});
}