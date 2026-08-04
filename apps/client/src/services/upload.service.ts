import type { CloudinarySignaturePayload, SuccessResponseData } from "@odiano/shared";
import { api } from "../libs/api";
import { uploadFileToCloudinary } from "./cloudinary.service";
import type { FileData, UploadedFileData } from "../types/file.type";
import type React from "react";

export const uploadProfileImage = async (blob: Blob) : Promise<UploadedFileData> => {
    // get profile signature
    const response = await api.get<SuccessResponseData<CloudinarySignaturePayload>>("/upload/profile-signature");

    const signaturePayload = response.data.data;

    if (!signaturePayload) {
        throw new Error("Missing signature payload");
    }

    // upload to cloudinary  
    const uploadedFileData = await uploadFileToCloudinary(blob, "profile.webp", signaturePayload);

    return uploadedFileData;
};

export const uploadCoverImage = async (blob: Blob) : Promise<UploadedFileData> => {
    // get cover signature 
    const response = await api.get<SuccessResponseData<CloudinarySignaturePayload>>("/upload/cover-signature");

    const signaturePayload = response.data.data;

    if (!signaturePayload) {
        throw new Error("Missing signature payload");
    }

    // upload to cloudinary
    const uploadedFileData = uploadFileToCloudinary(blob, "coverImage.webp", signaturePayload);

    return uploadedFileData;
}

export const uploadPostAssets = async (
    fileData: FileData[],
    setFileData: React.Dispatch<React.SetStateAction<FileData[] | null>>
): Promise<(UploadedFileData | null)[]> => {
    const response = await api.get<
        SuccessResponseData<CloudinarySignaturePayload[]>
    >("/upload/post-media", {
        params: {
            total: fileData.length,
        },
    });

    const signaturePayload = response.data.data;

    if (!signaturePayload) {
        throw new Error("Missing signature payload");
    }

    const uploadCount = Math.min(
        fileData.length,
        signaturePayload.length
    );

    const uploadedFiles = await Promise.all(
        Array.from(
            { length: uploadCount },
            async (_, index): Promise<UploadedFileData | null> => {
                const file = fileData[index];

                // Already uploaded previously
                if (file.prev?.publicId && file.prev.url) {
                    return {
                        publicId: file.prev.publicId,
                        url: file.prev.url,
                    };
                }

                if (!file.blob?.original) return null;

                try {
                    const result = await uploadFileToCloudinary(
                        file.blob.edited || file.blob.original,
                        `asset-${index}`,
                        signaturePayload[index]
                    );

                    setFileData(prev => {
                        if (!prev) return prev;

                        const next = [...prev];

                        next[index] = {
                            ...next[index],
                            uploaded: {
                                publicId: result.publicId,
                                url: result.url,
                            },
                            prev: {
                                blob: next[index].blob?.original,
                                publicId: result.publicId,
                                url: result.url,
                            },
                            error: undefined,
                        };

                        return next;
                    });

                    return result;
                } catch (error) {
                    console.error(`Upload ${index} failed`, error);
                    return null;
                }
            }
        )
    );

    return uploadedFiles;
};