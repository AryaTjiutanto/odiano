export const UPLOAD_PRESETS = {
    PROFILE : "upload_profile",
    COVER : "upload_cover"
} as const;

export type UploadPresets = typeof UPLOAD_PRESETS[keyof typeof UPLOAD_PRESETS];