import mongoose, { Types } from "mongoose";
import { LIKE_TYPES, LikeTypes } from "../consts/like.const";
import Like from "../models/like.model";
import { Post } from "../models/post.model";
import { AppError } from "../errors/appError.error";
import { ERROR_RESPONSE_CODE, NOTIFICATION_TARGET_TYPE, NOTIFICATION_TYPE } from "@connect/shared";
import { create as createNotification } from "./notification.service";

export const getLikedIds = async (currentUserId: string, type: LikeTypes, targetIds: string[] | Types.ObjectId[]) => {
    const likes = await Like.find({
        user: currentUserId,
        type,
        targetId: { $in: targetIds }
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
            const post = await Post.findById(postId, null, {session}).select("author visibility hideLikeAndViewCount isArchive turnOffCommething likeCount");
        
            if (!post) {
                throw new AppError(404, ERROR_RESPONSE_CODE.notFound, "Post is not foun");
            }
        
            if (post?.isArchive) {
                throw new AppError(409, ERROR_RESPONSE_CODE.conflict, "This post is archived and can no longer receive likes.");
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
                {_id : postId},
                {
                    $inc : {
                        likeCount : 1,
                    }
                },
                {session}
            )

            // create notification
            if(currentUserId !== post.author.toString()) {
                await createNotification(currentUserId, {
                    recepientId : post.author.toString(),
                    targetId : post._id.toString(),
                    targetType : NOTIFICATION_TARGET_TYPE.POST,
                    type : NOTIFICATION_TYPE.LIKE_YOUR_POST
                })
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
            }, null, {session});

            if (!like) {
                throw new AppError(404, ERROR_RESPONSE_CODE.notFound, "You have not liked this post yet");
            }

            // delete like
            await like.deleteOne({ session });

            // decrese post likeCount
            await Post.updateOne({ _id: postId }, {
                $inc : {
                    likeCount : -1
                }                
            }, { session })
        })
    } finally {
        await session.endSession();
    }
}