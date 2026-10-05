import { PostCommentDTO } from "@odiano/shared";
import { PostCommentQuery } from "../types/postComment.type.js";
import { toUserSummaryDTO } from "./user.mapper.js";

export const toPostCommentDTO = (data : PostCommentQuery) : PostCommentDTO => {
    const userSummaryDTO = {author : toUserSummaryDTO(data.author)};

    return {
        id : data._id.toString(),
        depth : data.depth,
        replyCount : data.replyCount,
        parentId : data.parentId?.toString(),
        content : data.content,
        createdAt : data.createdAt,
        ...userSummaryDTO
    }
}