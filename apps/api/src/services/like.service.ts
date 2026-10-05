import mongoose, { Types } from "mongoose";
import { LIKE_TYPES, LikeTypes } from "../consts/like.const.js";
import Like from "../models/like.model.js";
import { Post } from "../models/post.model.js";
import { AppError } from "../errors/appError.error.js";
import { ERROR_RESPONSE_CODE, NOTIFICATION_TARGET_TYPE, NOTIFICATION_TYPE, POST_STATUS } from "@odiano/shared";
import { create as createNotification } from "./notification.service.js";
import { Notification } from "../models/notification.model.js";

export const getLikedIds = async (currentUserId: string, type: LikeTypes, targetIds: string[] | Types.ObjectId[]) => {
    const likes = await Like.find({
        user: currentUserId,
        type,
        targetId: mongoose.trusted({
            $in: targetIds
        })
    }).select("targetId").lean();

    const likedPostIds = likes.map(like => like.targetId.toString());
    return likedPostIds;
}

export const getIsLiked = async (currentUserId: string, type: LikeTypes, targetId: string | Types.ObjectId) => {
    return !!(await Like.exists({
        user: currentUserId,
        type,
        targetId,
    }))
}

export const createPostLike = async (currentUserId: string, postId: string) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const post = await Post.findById(postId, null, { session }).select("publicId author visibility hideLikeAndViewCount turnOffCommething likeCount status content media");

            if (!post) {
                throw new AppError(404, ERROR_RESPONSE_CODE.notFound, "Post is not foun");
            }

            if (post.status !== POST_STATUS.ACTIVE) {
                throw new AppError(409, ERROR_RESPONSE_CODE.conflict, "This post can't be liked");
            }

            // create like
            await Like.create([
                {
                    user: currentUserId,
                    type: LIKE_TYPES.POST,
                    targetId: postId,
                }
            ], { session });

            // increase post like count
            await Post.updateOne(
                { _id: postId },
                {
                    $inc: {
                        likeCount: 1,
                    }
                },
                { session }
            )

            // check is an author
            if (post.author.toString() === currentUserId) return;
            
            // check is this notification exists
            const isNotificationExists = await Notification.exists({
                recepient: post.author,
                actor: currentUserId,
                "data.type" : NOTIFICATION_TYPE.LIKE,
                "data.target.type" : NOTIFICATION_TARGET_TYPE.POST,
                "data.target.id" : post._id.toString(),
            }).session(session);

            // create notification
            if (!isNotificationExists) {
                await createNotification(post.author.toString(), currentUserId, {
                    type: NOTIFICATION_TYPE.LIKE,
                    target: {
                        type : NOTIFICATION_TARGET_TYPE.POST,
                        id: post._id.toString(),
                        publicId: post.publicId,
                        content: post.content,
                        ...(post.media && {
                            firstMedia: {
                                type: post.media[0].type,
                                aspectRatio: post.media[0].aspectRatio,
                                url: post.media[0].source.url,
                                publicId: post.media[0].source.publicId,
                            }
                        }),
                        createdAt: new Date(),
                    }
                }, session)
            }
        })
    } finally {
        await session.endSession();
    }
}

export const deletePostLike = async (currentUserId: string, postId: string) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            const like = await Like.findOne({
                user: currentUserId,
                type: LIKE_TYPES.POST,
                targetId: postId,
            }, null, { session });

            if (!like) {
                throw new AppError(404, ERROR_RESPONSE_CODE.notFound, "You have not liked this post yet");
            }

            // delete like
            await like.deleteOne({ session });

            // decrese post likeCount
            await Post.updateOne({ _id: postId }, {
                $inc: {
                    likeCount: -1
                }
            }, { session })
        })
    } finally {
        await session.endSession();
    }
}