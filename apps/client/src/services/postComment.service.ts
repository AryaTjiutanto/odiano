import type { InfiniteQuery, PostCommentDTO, SuccessResponseData } from "@odiano/shared";
import { api } from "../libs/api";

export const getComment = async (commentId: string, postId: string) => {
    const response = await api.get<SuccessResponseData<PostCommentDTO>>(`post/${postId}/comment/${commentId}`);

    return response.data.data;
}

export const getCurrentUserComments = async (postId: string) => {
    const response = await api.get<SuccessResponseData<PostCommentDTO[]>>(`post/${postId}/comments/me`);

    return response.data.data;
}

export const getComments = async (postId: string, pageParam: string | null, exclude?: string | null) => {
    const response = await api.get<SuccessResponseData<InfiniteQuery<PostCommentDTO[]>>>(`post/${postId}/comments`, {
        params: {
            cursor: pageParam,
            ...(exclude && { exclude })
        }
    })

    if (!response.data.data?.items) throw new Error("Data is empty")

    return response.data.data;
}