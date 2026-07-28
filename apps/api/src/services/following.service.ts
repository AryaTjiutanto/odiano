import { ERROR_RESPONSE_CODE, NOTIFICATION_TARGET_TYPE, NOTIFICATION_TYPE, NotificationDTO } from "@odiano/shared"
import { AppError } from "../errors/appError.error"
import { Following } from "../models/following.model";
import { User } from "../models/user.model";
import mongoose, { Types } from "mongoose";
import { create as createNotification, deleteNotificationWithRecepient } from "./notification.service";

export const createFollowing = async (currentUserId: string, targetUserId: string) => {
    if (currentUserId == targetUserId) {
        throw new AppError(403, ERROR_RESPONSE_CODE.forbidden, "You can't follow you account");
    }

    // check is target user exist
    const isFollowUserExist = await User.exists({ _id: targetUserId });
    if (!isFollowUserExist) {
        throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Invalid data");
    }

    // check is following 
    const isFollowing = await Following.exists({ currentUserId, targetUserId });

    if (isFollowing) {
        throw new AppError(409, ERROR_RESPONSE_CODE.conflict, "Already following");
    }

    // start mongodb session
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            // create following and increase follow count
            await Following.create([
                {
                    userId: currentUserId,
                    followUserId: targetUserId,
                }
            ], { session })

            await User.updateOne({ _id: currentUserId }, { $inc: { followingCount: 1 } }, { session });
            await User.updateOne({ _id: targetUserId }, { $inc: { followerCount: 1 } }, { session });

            // create notification
            await createNotification(currentUserId, {
                recepientId: targetUserId,
                targetId: targetUserId,
                targetType: NOTIFICATION_TARGET_TYPE.USER,
                type: NOTIFICATION_TYPE.FOLLOW_YOU,
            }, session)
        })
    } finally {
        await session.endSession();
    }
}

export const deleteFollowing = async (currentUserId: string, followUserId: string) => {
    // checl is userId is current user id
    if (currentUserId !== currentUserId) {
        throw new AppError(403, ERROR_RESPONSE_CODE.forbidden, "Invalid data");
    }

    // check is following exist
    const isFollowing = await Following.exists({ userId: currentUserId, followUserId });

    if (!isFollowing) {
        throw new AppError(409, ERROR_RESPONSE_CODE.conflict, "You haven't followed this account yet");
    }

    // start mongodb session
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            await Following.deleteOne({ userId: currentUserId, followUserId }, { session });
            await User.updateOne({ _id: currentUserId }, { $inc: { followingCount: -1 } }, { session });
            await User.updateOne({ _id: followUserId }, { $inc: { followerCount: -1 } }, { session });

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

export const getFollowingIds = async (currentUserId: string): Promise<Types.ObjectId[]> => {
    const following = await Following.find({
        userId: currentUserId,
    }).select("followUserId").lean();
    
    const followingIds = following.map((data) => data.followUserId);

    return followingIds;
}