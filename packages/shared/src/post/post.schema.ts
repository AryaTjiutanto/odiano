import { z } from "zod";
import { CONTENT_LENGTH } from "./post.const";

export const createPostSchema = z.object({
    content: z.string("Invalid format")
        .min(0, "Content cannot be empty")
        .max(CONTENT_LENGTH.MAX, `Content maximum ${CONTENT_LENGTH} characters`),
    hideLikeAndViewCount: z.boolean("Invalid format"),
    turnOffComment: z.boolean("Invalid format")
})