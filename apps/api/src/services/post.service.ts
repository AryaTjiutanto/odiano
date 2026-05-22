import { CreatePostSchema } from "@connect/shared";
import { Post } from "../models/post.model";

export const create = async (userId : string, data : CreatePostSchema) => {
    const post = await Post.create({
        authorId : userId,
        ...data,
    });

    return post;
}