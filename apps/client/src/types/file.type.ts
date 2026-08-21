import type { AllowedMediaTypes, MediaAspectRatio } from "@odiano/shared"

export type UploadedFileData = {
    publicId: string,
    url: string
}

export type FileEditData = {
    aspectRatio: MediaAspectRatio,
    zoom: number,
    crop: { x: number, y: number },
}

export type FileEditResult = {
    blob : Blob,
    editData : FileEditData,
}

export type FileData = {
    id: string,
    url: string,
    type: AllowedMediaTypes,
    editData?: FileEditData,
    blob?: {
        original: Blob | undefined | null,
        edited?: Blob,
    },
    order?: number,
    uploaded?: {
        publicId: string,
        url: string,
    }
    prev?: {
        blob: Blob | undefined | null,
        publicId?: string,
        url?: string,
    }
    error?: {
        id: string,
        message: string,
    },
}

export type FileUploadProgress = Record<string, number>;

export type ImageEditorOptions = {
    aspectRatio: MediaAspectRatio,
    allowAspectRatioChange?: boolean,
}