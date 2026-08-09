import { z } from "zod";
import { ALLOWED_MEDIA_PROVIDERS, ALLOWED_MEDIA_TYPES, MEDIA_ASPECT_RATIO, MEDIA_HEIGHT, MEDIA_WIDTH, POST_CONTENT_LENGTH, POST_MAX_MEDIA, POST_VISIBILITIES } from "./post.const";
import { MediaSource, Post, PostMedia } from "./post.type";

const mediaSourceSchema = z.object({
    publicId: z
        .string("Public ID must be a string")
        .min(1, "Public ID is required"),

    url: z
        .string("URL must be a string")
        .url("Invalid media URL"),
}) satisfies z.ZodType<MediaSource>;

const mediaAspectRatio = z.union([
    z.literal(MEDIA_ASPECT_RATIO["1:1"]),
    z.literal(MEDIA_ASPECT_RATIO["4:5"]),
    z.literal(MEDIA_ASPECT_RATIO["16:9"]),
    z.literal(MEDIA_ASPECT_RATIO["9:16"]),
    z.literal(MEDIA_ASPECT_RATIO["7:5"]),
    z.literal(MEDIA_ASPECT_RATIO["original"]),
], `Invalid media aspect ratio`)

const mediaSchema = z.object({
    aspectRatio: mediaAspectRatio,
    provider: z.nativeEnum(ALLOWED_MEDIA_PROVIDERS, "Invalid media provider"),
    type : z.nativeEnum(ALLOWED_MEDIA_TYPES, "Invalid media type"),
    order : z.number("Media order must be a number")
        .min(0, "Media order is required")
        .max(POST_MAX_MEDIA, `Maximum order is ${POST_MAX_MEDIA}`),
    source : mediaSourceSchema,
}) satisfies z.ZodType<PostMedia>;


// base create post schema
export const createPostSchema = z.object({
    content: z.string("Invalid format")
        .max(
            POST_CONTENT_LENGTH.MAX,
            `Content maximum ${POST_CONTENT_LENGTH.MAX} characters`
        ),

    media: z.array(mediaSchema)
        .max(
            POST_MAX_MEDIA,
            `Maximum ${POST_MAX_MEDIA} media allowed`
        )
        .nullable(),

    isArchive: z.boolean("Invalid format"),
    hideLikeAndViewCount: z.boolean("Invalid format"),
    turnOffCommenting: z.boolean("Invalid format"),
    visibility: z.nativeEnum(POST_VISIBILITIES, "Invalid visibilities"),
}) satisfies z.ZodType<Omit<Post, "commentCount" | "likeCount">>;

// api create post schema
export const createPostApiSchema = createPostSchema.refine(
    (data) => {
        const hasMedia = data.media !== null && data.media.length > 0;
        const hasContent = data.content.trim().length > 0;

        return hasMedia || hasContent;
    },
    {
        path: ["content"],
        message: "Content cannot be empty when no media is provided",
    }
);

export type CreatePostApiSchema = z.infer<typeof createPostApiSchema>;
export type CreatePostSchema = z.infer<typeof createPostSchema>;