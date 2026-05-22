import { z } from "zod";
import { ALLOWED_MEDIA_PROVIDERS, ALLOWED_MEDIA_TYPES, MEDIA_HEIGHT, MEDIA_WIDTH, POST_CONTENT_LENGTH, POST_MAX_MEDIA, POST_VISIBILITIES } from "./post.const";
import { MediaSource, Post, PostMedia } from "./post.types";

const mediaSourceSchema = z.object({
    publicId: z
        .string("Public ID must be a string")
        .min(1, "Public ID is required"),

    url: z
        .string("URL must be a string")
        .url("Invalid media URL"),
}) satisfies z.ZodType<MediaSource>;

const mediaSchema = z.object({
    width: z
        .number("Width mmust be a number")
        .min(MEDIA_WIDTH.MIN, `Minimum width is ${MEDIA_WIDTH.MIN}px`)
        .max(MEDIA_WIDTH.MAX, `Maximum width is ${MEDIA_WIDTH.MAX}px`),

    height: z
        .number("Height must be a number")
        .min(MEDIA_HEIGHT.MIN, `Minimum height is ${MEDIA_HEIGHT.MIN}px`)
        .max(MEDIA_HEIGHT.MAX, `Maximum height is ${MEDIA_HEIGHT.MAX}px`),
    provider: z.nativeEnum(ALLOWED_MEDIA_PROVIDERS, "Invalid media provider"),
    type : z.nativeEnum(ALLOWED_MEDIA_TYPES, "Invalid media type"),
    order : z.number("Media order must be a number")
        .min(0, "Media order is required")
        .max(POST_MAX_MEDIA, `Maximum order is ${POST_MAX_MEDIA}`),
    source : mediaSourceSchema,
}) satisfies z.ZodType<PostMedia>;

export const createPostSchema = z.object({
    content: z.string("Invalid format")
        .min(1, "Content cannot be empty")
        .max(POST_CONTENT_LENGTH.MAX, `Content maximum ${POST_CONTENT_LENGTH} characters`),
    media : z.array(mediaSchema).max(POST_MAX_MEDIA, `Maximum ${POST_MAX_MEDIA} media allowed`).nullable(),
    isArchive : z.boolean("Invalid format"),
    hideLikeAndViewCount: z.boolean("Invalid format"),
    turnOffCommenting : z.boolean("Invalid format"),
    visibility : z.nativeEnum(POST_VISIBILITIES, "Invalid visibilities")
}) satisfies z.ZodType<Post>;

export type CreatePostSchema = z.infer<typeof createPostSchema>;