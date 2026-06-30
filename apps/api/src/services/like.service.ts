import mongoose, { Types } from "mongoose";
import { LIKE_TYPES, LikeTypes } from "../consts/like.const";
import Like from "../models/like.model";
import { Post } from "../models/post.model";
import { AppError } from "../errors/appError.error";
import { ERROR_RESPONSE_CODE } from "@connect/shared";

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
    const post = await Post.findById(postId).select("author visibility hideLikeAndViewCount isArchive turnOffCommething likeCount");

    if(!post) {
        throw new AppError(404,ERROR_RESPONSE_CODE.notFound, "Post is not foun");
    }

    if (post?.isArchive) {
        throw new AppError(403, ERROR_RESPONSE_CODE.conflict, "This post is archived and can no longer receive likes.");
    }

    // handle like
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            // create like
            await Like.create([
                {
                    user: currentUserId,
                    type: LIKE_TYPES.POST,
                    targetId: postId,
                }
            ], {session});
            
            // increase post like count
            post.likeCount++;
            await post.save({session});
        })
    } finally {
        await session.endSession();
    }
}

export const deletePostLike = async (currentUserId : string, postId : string) => {
    const like = await Like.findOne({
        user : currentUserId,
        type : LIKE_TYPES.POST,
        targetId : postId,
    });

    if(!like) {
        throw new AppError(404, ERROR_RESPONSE_CODE.notFound, "You have not like this post yet");
    }

    await like.deleteOne();
}