import { InfiniteQuery, NotificationDTO, NotificationType } from "@odiano/shared";
import { Notification } from "../models/notification.model"
import { emitToUser } from "../socket/emitters/notification.emitter";
import { getUserSummary } from "./user.service";
import { NOTIFICATION_PAGE_SIZE } from "../consts/notification.const";
import { toNotificationDTO } from "../mappers/notification.mapper";
import { UnauthorizedError } from "../errors/unauthorized.error";
import mongoose, { ClientSession, Types } from "mongoose";
import { NotificationDataSchema, NotificationQuery } from "../types/notification.type";
import logger from "../libs/log/logger";

export const get = async (currentUserId: string, cursor: string | undefined | null, isRead: boolean): Promise<InfiniteQuery<NotificationDTO[]>> => {
    // get notifications
    let notifications = await Notification.aggregate<NotificationQuery>([
        {
            $match: {
                recepient: new Types.ObjectId(currentUserId),
                isRead,
                ...(cursor && {
                    _id: mongoose.trusted({
                        $lt: cursor
                    })
                })
            }
        },
        {
            $sort: {
                _id: -1
            }
        },
        {
            $limit: NOTIFICATION_PAGE_SIZE + 1
        },
        {
            $lookup: {
                from: "users",
                localField: "data.actor",
                foreignField: "_id",
                as: "actor",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            username: 1,
                            profileImage: 1,
                        }
                    }
                ]
            }
        },
        {
            $set: {
                "data.actor": {
                    $arrayElemAt: ["$actor", 0]
                }
            }
        },
        {
            $project: {
                _id: 1,
                recepient: 1,
                isRead: 1,
                createdAt: 1,
                data: 1,
            }
        }
    ]);

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

export const updateAllReadStatus = async (currentUserId: string) => {
    await Notification.updateMany({
        recepient: currentUserId,
        isRead: false,
    }, {
        isRead: true,
    })
}

export const create = async (recepientId: string, data: NotificationDataSchema, session?: ClientSession) => {
    const notifications = await Notification.create([
        {
            recepient: recepientId,
            data,
        }
    ], { session });

    // emit to user
    const notificationDTO: NotificationDTO = {
        id: notifications[0]._id.toString(),
        recepient: recepientId,
        isRead: false,
        data: ("actor" in data) ? {
            ...data,
            actor: await getUserSummary(data.actor.toString()),
        } : data,
        createdAt: new Date(),
    };

    emitToUser(notificationDTO, recepientId);
}

export const getUnreadCount = async (currentUserId: string): Promise<number> => {
    // get unread notifications count
    const unreadCount = await Notification.countDocuments({
        recepient: currentUserId,
        isRead: false,
    });

    return unreadCount;
}

export const deleteNotificationWithRecepient = async (recepient: string, type?: NotificationType, session?: ClientSession) => {
    await Notification.deleteMany({
        recepient,
        ...(type && { type })
    }, { session });
}