import { CreatePostSchema, ERROR_RESPONSE_CODE, InfiniteQuery, PostDTO, type PostDTO as PostFeedItem } from "@connect/shared";
import { Post } from "../models/post.model";
import { toPostDto } from "../mapper/post.mapper";
import { PostQuery } from "../types/post.type";
import { POSTS_PAGE_SIZE } from "../consts/post.const";
import { AppError } from "../errors/appError.error";

export const listPosts = async (cursor : string | null): Promise<InfiniteQuery<PostFeedItem[]>> => {
    const query = cursor ? {
        _id : {$lt : cursor}
    } : {};

    // get posts data
    const posts = await Post.find(query)
        .sort({_id : -1})
        .select("content publicId media visibility hideLikeAndComment turnOffComment isArchive createdAt updatedAt")
        .populate("author", "name username profileImage")
        .limit(POSTS_PAGE_SIZE + 1).lean<PostQuery[]>();

    // organize the data
    const formatedPosts = posts.map((post) => toPostDto(post));
    let items = formatedPosts;
    let hasNextPage = false;

    if(formatedPosts.length > POSTS_PAGE_SIZE) {
        items = formatedPosts.slice(0, POSTS_PAGE_SIZE);
        hasNextPage = true;
    }

    let nextCursor = items[items.length - 1].id

    return {
        nextCursor,
        hasNextPage,
        items,
    }
}

export const getPost = async(publicId : string): Promise<PostDTO | null> => {
    const post = await Post.findOne({publicId})
        .select("content publicId media visibility hideLikeAndComment turnOffComment isArchive createdAt updatedAt")
        .populate("author", "name username profileImage")
        .lean<PostQuery>();

    if(!post) {
        throw new AppError(404, ERROR_RESPONSE_CODE.notFound, "This post is not available");
    }

    return toPostDto(post);
}

export const create = async (userId: string, data: CreatePostSchema) => {
    const post = await Post.create({
        author: userId,
        ...data,
    });

    return post;
}