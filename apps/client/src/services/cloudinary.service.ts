import type { CloudinarySignaturePayload } from "@odiano/shared";
import { getCloudinarySignedUrl } from "../utils/cloudinary.util";
import axios from "axios";
import type { UploadedFileData } from "../types/file.type";

export const uploadFileToCloudinary = async (blob : Blob, fileName : string, signaturePayload : CloudinarySignaturePayload) : Promise<UploadedFileData> => {
    // upload to cloudinary
    const file = new File([blob], `${fileName}`, { type: blob.type });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", signaturePayload.upload_preset);
    formData.append("timestamp", String(signaturePayload.timestamp));
    formData.append("signature", signaturePayload.signature);
    formData.append("folder", signaturePayload.folder);
    formData.append("api_key", signaturePayload.apiKey);

    const cloudinaryResponse = await axios.post(getCloudinarySignedUrl(signaturePayload.cloudName), formData);

    // return url and publicId
    const publicId = cloudinaryResponse.data.public_id;
    const url = cloudinaryResponse.data.secure_url;

    return {
        publicId,
        url
    }
}