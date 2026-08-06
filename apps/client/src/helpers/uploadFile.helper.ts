import type { FileData, UploadedFileData } from "../types/file.type";

export const uploadSingleFile = async (file: FileData, fn: (blob: Blob) => Promise<UploadedFileData>, setFileData: React.Dispatch<React.SetStateAction<FileData[] | null>>): Promise<FileData> => {
    // Already uploaded previously
    if (file.prev && file.prev.publicId && file.prev.url) {
        return file;
    }

    if (!file.blob?.original) {
        throw new Error("Missing image blob");
    }

    const uploaded = await fn(file.blob.edited || file.blob.original);

    const newData: FileData = {
        ...file,
        uploaded,
        prev: {
            blob: file.blob?.original,
            publicId: uploaded.publicId,
            url: uploaded.url,
        },
        error: undefined,
    }

    setFileData([newData]);

    return newData;
}