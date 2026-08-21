import { ALLOWED_MEDIA_TYPES, type AllowedMediaTypes, type CloudinarySignaturePayload } from "@odiano/shared";
import axios from "axios";
import type { UploadedFileData } from "../types/file.type";

export const uploadFileToCloudinary = async (blob : Blob, fileName : string, signaturePayload : CloudinarySignaturePayload, resourceType : AllowedMediaTypes = ALLOWED_MEDIA_TYPES.IMAGE, onUploadProgress : (progress : number) => void = () => {}) : Promise<UploadedFileData> => {
    // upload to cloudinary
    const file = new File([blob], `${fileName}`, { type: blob.type });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", signaturePayload.upload_preset);
    formData.append("timestamp", String(signaturePayload.timestamp));
    formData.append("signature", signaturePayload.signature);
    formData.append("folder", signaturePayload.folder);
    formData.append("api_key", signaturePayload.apiKey);

    const cloudinaryResponse = await axios.post(`https://api.cloudinary.com/v1_1/${signaturePayload.cloudName}/${resourceType}/upload`, formData, {
        onUploadProgress : (progressEvent) => {
            if(!progressEvent.total) return;

            onUploadProgress(Math.floor((progressEvent.loaded / progressEvent.total) * 100));
        }
    });

    // return url and publicId
    const publicId = cloudinaryResponse.data.public_id;
    const url = cloudinaryResponse.data.secure_url;

    return {
        publicId,
        url
    }
}