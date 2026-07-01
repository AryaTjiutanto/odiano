import { api } from "../libs/api";

export const createLike = async (postId : string) => {
    await api.post(`/post/${postId}/like`);
}

export const deleteLike = async (postId : string) => {
    await api.delete(`/post/${postId}/like/delete`);
}