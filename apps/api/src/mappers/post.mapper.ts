import { PostDTO } from "@odiano/shared";
import { type PostQuery } from "../types/post.type.js";
import { toUserSummaryDTO } from "./user.mapper.js";

type AdditionalData = {
    isLiked : boolean,
}

export const toPostDto = (post: PostQuery, {isLiked} : AdditionalData): PostDTO => {
    const userSummaryDTO = post.author?._id ? {author : toUserSummaryDTO(post.author)} : {};

    return {
        content: post.content,
        hideLikeAndViewCount: post.hideLikeAndViewCount,
        media: post.media,
        id: post._id.toString(),
        publicId: post.publicId,
        turnOffCommenting: post.turnOffCommenting,
        visibility: post.visibility,
        createdAt: post.createdAt,
        commentCount : post.commentCount,
        likeCount : post.likeCount,
        isLiked : isLiked,
        ...userSummaryDTO,
    }
}