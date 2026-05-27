import { CreatePostSchema, type PostDTO as PostFeedItem } from "@connect/shared";
import { Post } from "../models/post.model";
import { toPostDto } from "../mapper/post.mapper";
import { PostQuery } from "../types/post.type";

export const listPosts = async () : Promise<PostFeedItem[]> => {
    const posts = await Post.find({})
        .select("content publicId media visibility hideLikeAndComment turnOffComment isArchive createdAt updatedAt")
        .populate("author", "name username slug profileImage")
        .limit(10).lean<PostQuery[]>();

    return toPostDto(posts);
}

export const create = async (userId: string, data: CreatePostSchema) => {
    const post = await Post.create({
        author: userId,
        ...data,
    });

    return post;
}