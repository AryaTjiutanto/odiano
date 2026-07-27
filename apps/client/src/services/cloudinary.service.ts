import type { CloudinarySignaturePayload, SuccessResponseData } from "@odiano/shared";
import { api } from "../libs/api";
import { getCloudinarySignedUrl } from "../utils/cloudinary.util";
import axios from "axios";

type UploadImagePayload = {
    generatorRoute : string,
    imageName : string,
    imageCroppedBlob : Blob
};

type UploadedImagePayload = {
    publicId : string,
    url : string,
}

export const uploadImageToCloudinary = async (payload : UploadImagePayload) : Promise<UploadedImagePayload> => {
    // get signature
    const response = await api.get<SuccessResponseData<CloudinarySignaturePayload>>(payload.generatorRoute);
    const signaturePayload = response.data.data;
    if (!signaturePayload) {
        throw new Error("Missing signature payload");
    }

    // upload to cloudinary
    const file = new File([payload.imageCroppedBlob], `${payload.imageName}.webp`, { type: payload.imageCroppedBlob.type });

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