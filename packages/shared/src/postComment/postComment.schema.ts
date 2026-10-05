import z from "zod";
import { POST_COMMENT_CONTENT_LENGTH, POST_COMMENT_DEPTH } from "./postComment.const.js";

export const createPostCommentSchema = z.object({
    content: z.string()
        .min(POST_COMMENT_CONTENT_LENGTH.MIN, { message: `Comment cannot be empty` })
        .max(POST_COMMENT_CONTENT_LENGTH.MAX, { message: `Comment Maximum ${POST_COMMENT_CONTENT_LENGTH.MAX} characters` }),
    postId: z.string()
        .min(1, { message: `Something is missing` })
        .max(500, { message: `Invalid data` }),
    parentId: z.string()
        .max(500, { message: `Invalid data` })
        .optional()
        .nullable(),
    depth: z.number()
        .min(POST_COMMENT_DEPTH.MIN, { message: `Invalid data` })
        .max(POST_COMMENT_DEPTH.MAX, { message: `Invalid data` })
})

export type CreatePostCommentSchema = z.infer<typeof createPostCommentSchema>