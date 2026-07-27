import { InfiniteQuery, NotificationDTO, NotificationTargetType, NotificationType } from "@odiano/shared";
import { Notification } from "../models/notification.model"
import { emitToUser } from "../socket/emitters/notification.emitter";
import { getUserSummary } from "./user.service";
import { NOTIFICATION_PAGE_SIZE, notificationQuery } from "../consts/notification.const";
import { toNotificationDTO } from "../mappers/notification.mapper";
import { nanoid } from "nanoid";
import { UnauthorizedError } from "../errors/unauthorized.error";
import logger from "../libs/log/logger";
import { ClientSession } from "mongoose";

type createNotificationParams = {
    recepientId: string,
    targetId: string,
    targetType: NotificationTargetType,
    type: NotificationType,
}

export const get = async (currentUserId: string, cursor: string | undefined | null, isRead: boolean): Promise<InfiniteQuery<NotificationDTO[]>> => {
    // get notifications
    let notifications = await Notification.find({
        recepient: currentUserId,
        isRead,
        ...(cursor && {
            _id: {
                $lt: cursor
            }
        })
    })
        .sort({ _id: -1 })
        .select("_id recepient type targetType targetId isRead createdAt")
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
    };

    emitToUser(notificationDTO, params.recepientId);
}

export const deleteNotificationWithRecepient = async (recepient: string, type?: NotificationType, session? : ClientSession) => {
    await Notification.deleteMany({
        recepient,
        ...(type && { type })
    }, {session});
}