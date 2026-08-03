export type UploadedFileData = {
    publicId: string,
    url: string
}

export type FileData = {
    id: string,
    url: string,
    blob?: {
        original : Blob | undefined | null,
        edited? : Blob,
    },
    index? : number,

    uploaded? : {
        publicId: string,
        url: string,
    }
    prev?: {
        blob: Blob | undefined  | null,
        publicId?: string,
        url?: string,
    }
    error?: {
        id: string,
        message: string,
    },
}