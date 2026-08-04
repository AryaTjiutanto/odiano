import { useState, type ChangeEvent } from "react";
import { DEFAULT_ALLOWED_IMAGE_TYPES, DEFAULT_MAX_IMAGE_SIZE, DEFAULT_MAX_VIDEO_SIZE } from "../consts/file.const";
import type { FileEditData, FileData, UploadedFileData } from "../types/file.type";
import { notify } from "../helpers/notification/notify.helper";
import { uploadCoverImage, uploadPostAssets, uploadProfileImage } from "../services/upload.service";
import { uploadSingleFile } from "../helpers/uploadFile.helper";
import { ALLOWED_MEDIA_TYPES } from "@odiano/shared";

type UseImageUploadOptions = {
    maximumFiles?: number,
    allowedTypes?: string[],
    maxImageSize?: number,
    maxVideoSize?: number,
    type: "profile" | "cover" | "post-media",
};

const useFileUpload = ({
    allowedTypes = DEFAULT_ALLOWED_IMAGE_TYPES,
    maxImageSize = DEFAULT_MAX_IMAGE_SIZE,
    maxVideoSize = DEFAULT_MAX_VIDEO_SIZE,
    maximumFiles = 1,
    type,
}: UseImageUploadOptions) => {
    const [isCropping, setIsCropping] = useState<boolean>(false);
    const [croppingTarget, setCroppingTarget] = useState<number | null>(null);
    const [fileData, setFileData] = useState<FileData[] | null>(null);

    const processMultipleFiles = (files: FileList | undefined | null) => {
        if (!files) {
            return;
        }
        let filesArray: File[] = Array.from(files);

        // check file length
        const currentCount = fileData?.length || 0;
        if (maximumFiles !== 1 && currentCount >= maximumFiles) {
            notify.error({
                title: "Maximum files reached",
                description: `You can upload up to ${maximumFiles} file${maximumFiles > 1 ? "s" : ""}.`,
            });

            return;
        }

        if (currentCount + files.length > maximumFiles) {
            filesArray = filesArray.slice(0, maximumFiles - currentCount);
        }

        // process file
        filesArray.forEach((file) => {
            processFile(file);
        })
    }

    const processFile = (file: File | undefined) => {
        if (!file) {
            return;
        }

        if (maximumFiles !== 1 && fileData && fileData?.length >= maximumFiles) {
            notify.error({
                title: "Maximum files reached",
                description: `You can upload up to ${maximumFiles} file${maximumFiles > 1 ? "s" : ""}.`,
            });

            return;
        }

        // check file type
        if (!allowedTypes.includes(file.type)) {
            notify.error({ title: "Upload fail", "description": "Only png, jpeg and webp allowed" });

            return;
        }

        // check file size
        if (file.type.startsWith("image/") && file.size > maxImageSize) {
            notify.error({ title: "Upload fail", "description": `Max image size is ${maxImageSize / (1024 * 1024)}mb` });

            return;
        }

        if (file.type.startsWith("video/") && file.size > maxVideoSize) {
            notify.error({ title: "Upload fail", "description": `Max video size is ${maxVideoSize / (1024 * 1024)}mb` });

            return;
        }

        const url = URL.createObjectURL(file);

        if (maximumFiles === 1) {
            setFileData((oldData) => {
                return [
                    {
                        ...(oldData && { ...oldData[0] }),
                        id: crypto.randomUUID(),
                        url,
                        blob: {
                            original: file,
                        },
                        type : file.type.split("/")[0] == ALLOWED_MEDIA_TYPES.IMAGE ? ALLOWED_MEDIA_TYPES.IMAGE : ALLOWED_MEDIA_TYPES.VIDEO
                    }
                ]
            })

            setIsCropping(true);
            setCroppingTarget(0);
        } else {
            const data: FileData = {
                id: crypto.randomUUID(),
                url,
                type : file.type.split("/")[0] == ALLOWED_MEDIA_TYPES.IMAGE ? ALLOWED_MEDIA_TYPES.IMAGE : ALLOWED_MEDIA_TYPES.VIDEO,
                blob: {
                    original: file,
                },
            }

            setFileData((oldData) => [
                ...(oldData ?? []),
                data,
            ])
        }
    }

    const removeFile = (index: number, fn?: () => void) => {
        const newData = fileData?.filter((_, i) => i !== index);

        setFileData(newData || null);
        if (fn) fn();
    }

    const handleImageInput = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (files?.length == 1) {
            processFile(files[0]);
            return;
        }

        processMultipleFiles(files);
    }

    const uploadFile = async (): Promise<UploadedFileData | (UploadedFileData | null)[] | null | undefined> => {
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

            case "post-media": {
                return await uploadPostAssets(fileData, setFileData);
            }
        }
    };

    const setImageCroppedBlob = (blob: Blob, fileIndex: number = 0) => {
        if (!blob) return;

        setFileData(prev => {
            if (!prev) return prev;

            const next = [...prev];

            next[fileIndex] = {
                ...next[fileIndex],
                blob: {
                    original: next[0].blob?.original,
                    edited: blob,
                },
            };

            return next;
        });
    }

    const setImageFileEditData = (fileIndex: number, data: FileEditData) => {
        if (!fileData || fileData.length === 0) {
            return;
        }

        const next = [...fileData];

        next[fileIndex] = {
            ...next[fileIndex],
            editData: data,
        }

        setFileData(next);
    }

    return {
        fileData,

        processMultipleFiles,
        processFile,
        uploadFile,
        handleImageInput,
        removeFile,

        isCropping,
        setIsCropping,
        croppingTarget,
        setCroppingTarget,

        setImageCroppedBlob,
        setImageFileEditData,
    }
}

export default useFileUpload;