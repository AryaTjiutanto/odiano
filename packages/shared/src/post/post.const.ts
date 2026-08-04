// post setting
export const POST_CONTENT_LENGTH = {
    MIN : 0,
    MAX : 300,
} as const;

export const POST_MAX_MEDIA = 6 as const;

export const POST_VISIBILITIES = {
    PUBLIC : "public",
    FOLLOWERS : "followers"
} as const;
export type PostVisibilities = typeof POST_VISIBILITIES[keyof typeof POST_VISIBILITIES];

// media property
export const MEDIA_WIDTH = {
    MAX : 10000,
    MIN : 100,
} as const;

export const MEDIA_HEIGHT = {
    MAX : 10000,
    MIN : 100,
} as const;

// media provider
export const ALLOWED_MEDIA_PROVIDERS = {
    CLOUDINARY : "cloudinary",
} as const;
export type AllowedMediaProviders = typeof ALLOWED_MEDIA_PROVIDERS[keyof typeof ALLOWED_MEDIA_PROVIDERS];

// media types
export const ALLOWED_MEDIA_TYPES = {
    IMAGE : 'image',
    VIDEO : 'video',
}
export type AllowedMediaTypes = typeof ALLOWED_MEDIA_TYPES[keyof typeof ALLOWED_MEDIA_TYPES];

// media aspect ratio
export const MEDIA_ASPECT_RATIO = {
    "1:1": 1,
    "4:5": 4 / 5,
    "16:9": 16 / 9,
    "7:5": 7 / 5,
    "9:16": 9 / 16,
} as const;
export type MediaAspectRatio = typeof MEDIA_ASPECT_RATIO[keyof typeof MEDIA_ASPECT_RATIO];