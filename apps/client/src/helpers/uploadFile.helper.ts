import type { FileData, UploadedFileData } from "../types/file.type";

export const uploadSingleFile = async (file : FileData, fn : (blob : Blob) => Promise<UploadedFileData>, setFileData : React.Dispatch<React.SetStateAction<FileData[] | null>>) => {
    // Already uploaded previously
    if (file.prev) {
        return {
            publicId: file.prev.publicId,
            url: file.prev.url,
        };
    }

    if (!file.blob) {
        throw new Error("Missing image blob");
    }

    const uploaded = await fn(file.blob);

    setFileData(prev => {
        if (!prev) return prev;

        const next = [...prev];

        next[0] = {
            ...next[0],
            uploaded,
            prev: {
                blob: next[0].blob!,
                publicId: uploaded.publicId,
                url: uploaded.url,
            },
            error: undefined,
        };

        return next;
    });

    return uploaded;
}