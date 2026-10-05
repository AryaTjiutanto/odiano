import { ERROR_RESPONSE_CODE, NOTIFICATION_TARGET_TYPE, NOTIFICATION_TYPE } from "@odiano/shared"
import { AppError } from "../errors/appError.error.js"
import { Following } from "../models/following.model.js";
import { User } from "../models/user.model.js";
import mongoose, { Types } from "mongoose";
import { create as createNotification } from "./notification.service.js";
import { Notification } from "../models/notification.model.js";

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

            // check is this following notification exists
            const isNotificationExists = await Notification.exists({
                recepient: targetUserId,
                actor: currentUserId,
                "data.type": NOTIFICATION_TYPE.FOLLOW,
            }).session(session);

            // create notification
            if (!isNotificationExists) {
                await createNotification(targetUserId, currentUserId, {
                    type: NOTIFICATION_TYPE.FOLLOW,
                }, session)
            }
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