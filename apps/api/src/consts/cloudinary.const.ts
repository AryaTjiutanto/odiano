export const UPLOAD_PRESETS = {
    PROFILE : "upload_profile",
    COVER : "upload_cover",
    POST_MEDIA : "upload_post_media",
} as const;

export type UploadPresets = typeof UPLOAD_PRESETS[keyof typeof UPLOAD_PRESETS];