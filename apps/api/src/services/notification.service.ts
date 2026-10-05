import { InfiniteQuery, NotificationData, NotificationDTO, NotificationType } from "@odiano/shared";
import { Notification } from "../models/notification.model.js"
import { emitToUser } from "../socket/emitters/notification.emitter.js";
import { getUserSummary } from "./user.service.js";
import { NOTIFICATION_PAGE_SIZE } from "../consts/notification.const.js";
import { toNotificationDTO } from "../mappers/notification.mapper.js";
import { UnauthorizedError } from "../errors/unauthorized.error.js";
import mongoose, { ClientSession, Types } from "mongoose";
import { NotificationQuery } from "../types/notification.type.js";

export const get = async (currentUserId: string, cursor: string | undefined | null, isRead: boolean): Promise<InfiniteQuery<NotificationDTO[]>> => {
    // get notifications
    let notifications = await Notification.aggregate<NotificationQuery>([
        {
            $match: {
                recepient: new Types.ObjectId(currentUserId),
                isRead,
                ...(cursor && {
                    _id: mongoose.trusted({
                        $lt: new Types.ObjectId(cursor),
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
            $limit: NOTIFICATION_PAGE_SIZE
        },
        {
            $lookup: {
                from: "users",
                localField: "actor",
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
                "actor": {
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
                actor: 1,
            }
        }
    ]);
    
    // organize the data
    const lastId = notifications[notifications.length - 1]?._id;
    const hasNextDocument = (notifications.length >= NOTIFICATION_PAGE_SIZE && lastId) ? await Notification.exists({
        recepient: currentUserId,
        isRead,
        _id : mongoose.trusted({
            $lt : lastId,
        })
    }) : false;
    
    const items = notifications.map(toNotificationDTO);

    return {
        hasNextPage : !!hasNextDocument,
        items: items,
        nextCursor: hasNextDocument ? items[items.length - 1].id : null,
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

export const create = async (recepientId: string, actorId: string | null, data: NotificationData, session?: ClientSession) => {
    const notifications = await Notification.create([
        {
            recepient: recepientId,
            data,
            actor: actorId ? new Types.ObjectId(actorId) : null,
        }
    ], { session });

    // emit to user
    const notificationDTO: NotificationDTO = {
        id: notifications[0]._id.toString(),
        recepient: recepientId,
        isRead: false,
        data : data,
        actor: actorId ? await getUserSummary(actorId) : null,
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