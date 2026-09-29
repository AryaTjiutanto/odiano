import type { CreatedDocumentId, InfiniteQuery, PostDTO, SuccessResponseData } from "@odiano/shared";
import { api } from "../libs/api";
import type { CreateCommentMutationParams } from "../types/post.type";

const baseRoute = "/post";

// like
export const createLike = async (postId: string) => {
    await api.post(`${baseRoute}/${postId}/like`);
}

export const deleteLike = async (postId: string) => {
    await api.delete(`${baseRoute}/${postId}/like/delete`);
}

// comment
export const createComment = async ({ data }: CreateCommentMutationParams) => {
    const response = await api.post<SuccessResponseData<CreatedDocumentId>>(`${baseRoute}/comment/create`, data)

    if (!response.data.data) {
        throw new Error("Something is missing");
    }

    return response.data.data?.id;
};

// get user posts
export const getUserPosts = async (cursor: string | undefined | null, username: string): Promise<InfiniteQuery<PostDTO[]>> => {
    const response = await api<SuccessResponseData<InfiniteQuery<PostDTO[]>>>(`/post/user/${username}`, {
        params: {
            cursor,
        }
    });

    if (!response.data.data) {
        throw new Error("Data is empty");
    }

    return response.data.data;
}

// get posts
export const getPost = async (publicId : string) => {
    const response = await api.get<SuccessResponseData<PostDTO>>(`/post/${publicId}`);

    if (!response.data.data) {
        throw new Error("Data is missing");
    }

    return response.data.data;
}

export const getPosts = async (cursor: string | undefined | null): Promise<InfiniteQuery<PostDTO[]>> => {
    const response = await api.get<SuccessResponseData<InfiniteQuery<PostDTO[]>>>("/post", {
        params: {
            cursor,
        }
    });

    if (!response.data.data) {
        throw new Error("No post available");
    }

    return response.data.data;
}

// delete post
export const deletePost = async (postId: string) => {
    await api.delete(`${baseRoute}/${postId}`);
}

// delete comment
export const deleteComment = async (commentId: string) => {
    await api.delete(`${baseRoute}/comment/${commentId}`);
}