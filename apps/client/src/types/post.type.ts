import type { CreatePostCommentSchema, InfiniteQuery, PostDTO } from "@odiano/shared";
import type { InfiniteData } from "@tanstack/react-query";

export type InfiniteQueryPostDTO = InfiniteData<InfiniteQuery<PostDTO[]>>;
export type CreateCommentMutationParams = {
    data: CreatePostCommentSchema,
    commentId: string,
}