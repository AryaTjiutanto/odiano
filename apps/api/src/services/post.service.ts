import { CreatePostSchema, ERROR_RESPONSE_CODE, InfiniteQuery, PostDTO, type PostDTO as PostFeedItem } from "@connect/shared";
import { Post } from "../models/post.model";
import { toPostDto } from "../mapper/post.mapper";
import { PostQuery } from "../types/post.type";
import { POSTS_PAGE_SIZE } from "../consts/post.const";
import { AppError } from "../errors/appError.error";
import { User } from "../models/user.model";
import { PostUserQuery } from "../types/user.type";

export const listPosts = async (cursor: string | null): Promise<InfiniteQuery<PostFeedItem[]>> => {
    const query = cursor ? {
        _id: { $lt: cursor }
    } : {};

    // get posts data
    const posts = await Post.find(query)
        .sort({ _id: -1 })
        .select("content publicId media visibility hideLikeAndComment turnOffComment isArchive createdAt updatedAt")
        .populate("author", "name username profileImage")
        .limit(POSTS_PAGE_SIZE + 1).lean<PostQuery[]>();

    // organize the data
    const formatedPosts = posts.map((post) => toPostDto(post));
    let items = formatedPosts;
    let hasNextPage = false;

    if (formatedPosts.length > POSTS_PAGE_SIZE) {
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

export const getPost = async (publicId: string): Promise<PostDTO | null> => {
    const post = await Post.findOne({ publicId })
        .select("content publicId media visibility hideLikeAndComment turnOffComment isArchive createdAt updatedAt")
        .populate("author", "name username profileImage")
        .lean<PostQuery>();

    if (!post) {
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

export const getUserPosts = async (username: string, cursor: string | null): Promise<InfiniteQuery<PostDTO[]>> => {
    const user = await User.findOne({ username })
        .select('_id')
        .lean();

    if (!user) {
        throw new AppError(404, ERROR_RESPONSE_CODE.notFound, "User not found");
    }

    const query = {
        author: user._id,
        ...(cursor ?
            {
                _id: {
                    $lt: cursor
                }
            }
            :
            {}
        )
    }

    // get posts
    const posts = await Post.find(query)
        .sort({ _id: -1 })
        .select("_id publicId content media visibility hideLikeAndViewCount turnOffCommenting isArchive createdAt updatedAt")
        .limit(POSTS_PAGE_SIZE + 1)
        .lean<PostQuery[]>();


    let items = posts;

    // handle hasNextPage
    let hasNextPage = false;
    if(posts.length > POSTS_PAGE_SIZE) {
        hasNextPage = true;
        items = posts.slice(0, POSTS_PAGE_SIZE);
    }

    // formatting the data
    const data = items.map((item) => toPostDto(item));

    // cursor
    const nextCursor = data[data.length - 1].id;

    return {
        hasNextPage,
        nextCursor,
        items: data,
    };
}