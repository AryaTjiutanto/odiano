import { useState, type ChangeEvent } from "react";
import { DEFAULT_ALLOWED_IMAGE_TYPES, DEFAULT_MAX_IMAGE_SIZE } from "../consts/file.const";
import type { FileData, UploadedFileData } from "../types/file.type";
import { notify } from "../helpers/notification/notify.helper";
import { uploadCoverImage, uploadProfileImage } from "../services/upload.service";
import { uploadSingleFile } from "../helpers/uploadFile.helper";

type UseImageUploadOptions = {
    maximumFiles?: number,
    allowedTypes?: string[],
    maxSize?: number,
    autoCropping?: boolean,
    type: "profile" | "cover" | "post-asset",
};

const useFileUpload = ({
    allowedTypes = DEFAULT_ALLOWED_IMAGE_TYPES,
    maxSize = DEFAULT_MAX_IMAGE_SIZE,
    autoCropping = true,
    maximumFiles = 1,
    type,
}: UseImageUploadOptions) => {
    const [isCropping, setIsCropping] = useState<boolean>(false);
    const [fileData, setFileData] = useState<FileData[] | null>(null);

    const processFile = (file: File | undefined) => {
        if (!file) {
            return;
        }

        if (fileData && fileData?.length >= maximumFiles) {
            notify.error({
                title: "Maximum files reached",
                description: `You can upload up to ${maximumFiles} file${maximumFiles > 1 ? "s" : ""}.`,
            });

            return;
        }

        if (!allowedTypes.includes(file.type)) {
            notify.error({ title: "Upload fail", "description": "Only png, jpeg and webp allowed" });

            return;
        }

        if (file.size > maxSize) {
            notify.error({ title: "Upload fail", "description": `Max image size is ${maxSize / (1024 * 1024)}mb` });

            return;
        }

        const url = URL.createObjectURL(file);
        const data: FileData = {
            id: crypto.randomUUID(),
            url,
            blob: file,
        }

        setFileData((oldData) => [
            ...(oldData ?? []),
            data,
        ])

        if (autoCropping) {
            setIsCropping(true);
        }
    }

    const removeFile = (id: string, fn: () => void) => {
        const newData = fileData?.filter((data) => data.id !== id);

        setFileData(newData || null);
        fn();
    }

    const handleImageInput = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        processFile(file);
    }

    const uploadFile = async (): Promise<UploadedFileData | UploadedFileData[] | null | undefined> => {
        if (!fileData || fileData.length === 0) {
            throw new Error("File is empty");
        }

        switch (type) {
            case "profile": {
                return await uploadSingleFile(fileData[0], async (blob: Blob) => uploadProfileImage(blob), setFileData);
            }

            case "cover": {
                return await uploadSingleFile(fileData[0], async (blob: Blob) => uploadCoverImage(blob), setFileData);
            }

            case "post-asset": {
                // return await uploadPostAssets(fileData, setFileData);
            }
        }
    };

    return {
        processFile,
        uploadFile,
        handleImageInput,
        removeFile,

        isCropping,
        setIsCropping,
    }
}

export default useFileUpload;