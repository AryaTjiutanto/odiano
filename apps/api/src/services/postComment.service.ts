import { InfiniteQuery, PostCommentDTO } from "@connect/shared"
import { toPostCommentDTO } from "../mapper/postComment.mapper"
import PostComment from "../models/postComment.model"
import { PostCommentQuery } from "../types/postComment.type"
import { POSTCOMMENT_PAGE_SIZE } from "../consts/postComment.const"
import logger from "../libs/log/logger"

type createPostCommentParams = {
    content: string,
    authorId: string,
    postId: string,
    parentId: string | null | undefined,
    depth: number
}

export const create = async ({ content, authorId, postId, parentId, depth }: createPostCommentParams) => {
    await PostComment.create({
        content,
        author: authorId,
        postId,
        parentId,
        depth,
    })
}

export const get = async (postId: string, cursor: string | undefined | null, userId?: string): Promise<InfiniteQuery<PostCommentDTO[]>> => {
    // get comments
    const comments = await PostComment.find({
            postId, 
            depth: 0,
            ...(userId && {owner : userId}),
            ...(cursor ? {
                _id : {
                    $lt : cursor
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

    let nextCursor = formattedComments[formattedComments.length - 1].id;

    return {
        hasNextPage,
        nextCursor,
        items: formattedComments
    };
}