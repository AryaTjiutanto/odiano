import { ERROR_RESPONSE_CODE, NOTIFICATION_TARGET_TYPE, NOTIFICATION_TYPE, NotificationDTO } from "@connect/shared"
import { AppError } from "../errors/appError.error"
import { Following } from "../models/following.model";
import { User } from "../models/user.model";
import mongoose from "mongoose";
import { create as createNotification, deleteNotificationWithRecepient } from "./notification.service";

export const createFollowing = async (currentUserId: string, userId: string, followUserId: string) => {
    // checl is userId is current user id
    if (userId !== currentUserId) {
        throw new AppError(403, ERROR_RESPONSE_CODE.forbidden, "Invalid data");
    }

    // check is follow user exist
    const isFollowUserExist = await User.exists({ _id: followUserId });
    if (!isFollowUserExist) {
        throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Invalid data");
    }

    // check is following exist
    const followingExist = await Following.exists({ userId, followUserId });

    if (followingExist) {
        throw new AppError(409, ERROR_RESPONSE_CODE.conflict, "Already following");
    }

    // start mongodb session
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            // create following and increase follow count
            await Following.create([
                {
                    userId,
                    followUserId,
                }
            ], { session })

            await User.updateOne({ _id: currentUserId }, { $inc: { followingCount: 1 } }, {session});
            await User.updateOne({ _id: followUserId }, { $inc: { followerCount: 1 } }, {session});

            // create notification
            await createNotification(currentUserId, {
                recepientId: followUserId,
                targetId: followUserId,
                targetType: NOTIFICATION_TARGET_TYPE.USER,
                type: NOTIFICATION_TYPE.FOLLOW_YOU,
            }, session)
        })
    } finally {
        await session.endSession();
    }
}

export const deleteFollowing = async (currentUserId: string, userId: string, followUserId: string) => {
    // checl is userId is current user id
    if (userId !== currentUserId) {
        throw new AppError(403, ERROR_RESPONSE_CODE.forbidden, "Invalid data");
    }

    // check is following exist
    const followingExist = await Following.exists({ userId, followUserId });

    if (!followingExist) {
        throw new AppError(409, ERROR_RESPONSE_CODE.conflict, "You haven't followed this account yet");
    }

    // start mongodb session
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            await Following.deleteOne({ userId, followUserId }, {session});
            await User.updateOne({ _id: currentUserId }, { $inc: { followingCount: -1 } }, {session});
            await User.updateOne({ _id: followUserId }, { $inc: { followerCount: -1 } }, {session});

            await deleteNotificationWithRecepient(followUserId, NOTIFICATION_TYPE.FOLLOW_YOU, session);
        });
    } finally {
        await session.endSession();
    }
}

export const isFollowing = async (currentUserId: string, followUserId: string) => {
    const result = await Following.exists({ userId: currentUserId, followUserId });

    return !!result;
}
