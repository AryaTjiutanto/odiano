import { ERROR_RESPONSE_CODE, InfiniteQuery, NOTIFICATION_TARGET_TYPE, NOTIFICATION_TYPE, PostCommentDTO } from "@connect/shared"
import { toPostCommentDTO } from "../mapper/postComment.mapper"
import PostComment from "../models/postComment.model"
import { PostCommentQuery } from "../types/postComment.type"
import { MAX_TOP_LEVEL_POSTCOMMENT, POSTCOMMENT_PAGE_SIZE } from "../consts/postComment.const"
import { AppError } from "../errors/appError.error"
import { Post } from "../models/post.model"
import { create as createNotification } from "./notification.service";
import mongoose from "mongoose"

type createPostCommentParams = {
    content: string,
    authorId: string,
    postId: string,
    parentId: string | null | undefined,
    depth: number
}

type GetCommentParams = {
    postId: string,
    cursor: string | undefined,
    userId: string | undefined,
}

export const create = async ({ content, authorId, postId, parentId, depth }: createPostCommentParams) => {
    // get post and post owner
    const post = await Post.findOne({ _id: postId })
        .select("visibility isArchive turnOffCommenting commentCount")
        .populate("author", "_id");

    if (!post) {
        throw new AppError(
            404,
            ERROR_RESPONSE_CODE.notFound,
            "Post is not available"
        )
    }

    if (post?.isArchive) {
        throw new AppError(
            403,
            ERROR_RESPONSE_CODE.conflict,
            "Comments cannot be added to an archived post."
        );
    }

    if (post?.turnOffCommenting) {
        throw new AppError(
            403,
            ERROR_RESPONSE_CODE.conflict,
            "Comments are disabled for this post."
        );
    }


    // increase totalComment when the depth is 0
    if (depth == 0) {
        const totalComment = await PostComment.countDocuments({ postId, author: authorId, depth: 0 });

        if (totalComment > MAX_TOP_LEVEL_POSTCOMMENT) {
            throw new AppError(403, ERROR_RESPONSE_CODE.forbidden, `You have reached the maximum number of comments allowed for this post.`);
        }
    }

    // handle create postcomment
    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            // create postComment
            await PostComment.create([
                {
                    content,
                    author: authorId,
                    postId,
                    parentId,
                    depth,
                }
            ], { session })

            // increate post comment count
            post.commentCount++;
            await post.save({ session });

            // create notification
            const postAuthorId = post.author._id.toString();

            if (authorId !== postAuthorId) {
                await createNotification(authorId, {
                    recepientId: postAuthorId,
                    targetId: postId,
                    targetType: NOTIFICATION_TARGET_TYPE.POST,
                    type: NOTIFICATION_TYPE.COMMENT_ON_YOUR_POST
                }, session);
            }
        })
    } finally {
        await session.endSession();
    }
}

export const get = async ({ cursor, postId, userId }: GetCommentParams): Promise<InfiniteQuery<PostCommentDTO[]>> => {
    // get comment
    const comments = await PostComment.find({
        postId,
        ...(userId ? { author: { $ne: userId } } : {}),
        depth: 0,
        ...(cursor ? {
            _id: {
                $lt: cursor
            }
        } : {})
    })
        .sort({ _id: -1 })
        .select("_id parentId content depth replyCount createdAt")
        .populate("author", "_id name username profileImage")
        .limit(POSTCOMMENT_PAGE_SIZE + 1)
        .lean<PostCommentQuery[]>();


    // handle infinite query data
    let hasNextPage = false;
    let items = comments;

    if (comments.length > POSTCOMMENT_PAGE_SIZE) {
        hasNextPage = true;
        items = comments.slice(0, POSTCOMMENT_PAGE_SIZE);
    }


    // format the comments
    const formattedComments = items.map(item => toPostCommentDTO(item));

    let nextCursor = formattedComments[formattedComments.length - 1]?.id;


    return {
        hasNextPage,
        nextCursor,
        items: formattedComments
    };
}

export const getCurrentUserComments = async (userId: string, postId: string): Promise<PostCommentDTO[]> => {
    const comments = await PostComment.find({
        postId,
        author: userId,
        depth: 0,
    })
        .sort({ _id: -1 })
        .select("_id parentId content depth replyCount createdAt")
        .populate("author", "_id name username profileImage")
        .lean<PostCommentQuery[]>();

    const formattedComments = comments.map(toPostCommentDTO);

    return formattedComments;
}