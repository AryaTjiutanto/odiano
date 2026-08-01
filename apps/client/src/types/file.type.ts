export type UploadedFileData = {
    publicId: string,
    url: string
}

export type FileData = {
    id: string,
    url: string,
    blob?: Blob,
    index? : number,
    uploaded? : {
        publicId: string,
        url: string,
    }
    prev?: {
        blob: Blob,
        publicId: string,
        url: string,
    }
    error?: {
        id: string,
        message: string,
    },
}