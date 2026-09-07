import { CreatedDocumentId, ERROR_RESPONSE_CODE, InfiniteQuery, NOTIFICATION_TARGET_TYPE, NOTIFICATION_TYPE, POST_STATUS, PostCommentDTO } from "@odiano/shared"
import { toPostCommentDTO } from "../mappers/postComment.mapper"
import PostComment from "../models/postComment.model"
import { PostCommentQuery } from "../types/postComment.type"
import { MAX_TOP_LEVEL_POSTCOMMENT, POSTCOMMENT_PAGE_SIZE } from "../consts/postComment.const"
import { AppError } from "../errors/appError.error"
import { Post } from "../models/post.model"
import { create as createNotification } from "./notification.service";
import mongoose from "mongoose"
import { UnauthorizedError } from "../errors/unauthorized.error"

type createPostCommentParams = {
    content: string,
    authorId: string,
    postId: string,
    parentId: string | null | undefined,
    depth: number
}

export const create = async ({ content, authorId, postId, parentId, depth }: createPostCommentParams): Promise<CreatedDocumentId> => {
    // get post and post owner
    const post = await Post.findOne({ _id: postId })
        .select("publicId content media visibility publicId status turnOffCommenting commentCount")
        .populate("author", "_id");

    if (!post) {
        throw new AppError(
            404,
            ERROR_RESPONSE_CODE.notFound,
            "Post is not available"
        )
    }

    if (post.status !== POST_STATUS.ACTIVE) {
        throw new AppError(
            409,
            ERROR_RESPONSE_CODE.conflict,
            "Comments cannot be added to this post."
        );
    }

    if (post?.turnOffCommenting) {
        throw new AppError(
            409,
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
        const result = await session.withTransaction(async () => {
            // create postComment
            const [postComment] = await PostComment.create([
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
                    type: NOTIFICATION_TYPE.COMMENT_ON_YOUR_POST,
                    data: {
                        comment : {
                            id: postComment._id.toString(),
                            message: content,
                        },
                        post: {
                            id: post._id.toString(),
                            publicId: post.publicId,
                            ...(post.content && { content: post.content }),
                            ...(post.media && {
                                firstMedia: {
                                    type : post.media[0].type,
                                    aspectRatio: post.media[0].aspectRatio,
                                    url: post.media[0].source.url,
                                    publicId: post.media[0].source.publicId,
                                }
                            })
                        }
                    }
                }, session);
            }

            return postComment._id.toString();
        })

        return {
            id: result,
        };
    } finally {
        await session.endSession();
    }
}

export const deleteComment = async (currentUserId: string, commentId: string) => {
    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {
            // check authorization
            const deletedComment = await PostComment.findOneAndDelete({
                _id: commentId,
                author: currentUserId
            }, {
                session,
                projection: {
                    postId: 1,
                }
            })

            if (!deletedComment) {
                throw new AppError(404, ERROR_RESPONSE_CODE.notFound, "Comment not found");
            }

            // decrese post commentCount
            await Post.updateOne({ _id: deletedComment?.postId }, {
                $inc: {
                    commentCount: -1
                }
            }, { session });
        })
    } finally {
        await session.endSession();
    }
}

export const getOne = async (commentId: string, postId: string): Promise<PostCommentDTO> => {
    const comment = await PostComment.findOne({ _id: commentId, postId })
    .select("_id parentId content depth replyCount createdAt")
    .populate("author", "_id name username profileImage")
    .lean<PostCommentQuery>();

    if (!comment) {
        throw new AppError(404, ERROR_RESPONSE_CODE.notFound, "Comment not found");
    }

    return toPostCommentDTO(comment);
}

export const get = async (cursor: string | undefined, postId: string, currentUserId: string | undefined, exclude: string | undefined | null): Promise<InfiniteQuery<PostCommentDTO[]>> => {
    // check is user authenticated
    if (cursor && !currentUserId) {
        throw new UnauthorizedError();
    }

    // get comment
    const comments = await PostComment.find({
        postId,
        ...(currentUserId ? { author: mongoose.trusted({ $ne: currentUserId }) } : {}),
        depth: 0,
        ...(cursor && {
            _id: mongoose.trusted({
                mongoose$lt: cursor
            })
        }),
        ...(exclude && {
            _id: mongoose.trusted({
                $ne: exclude
            })
        })
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