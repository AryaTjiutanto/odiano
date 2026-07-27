import { CloudinarySignaturePayload } from "@odiano/shared";
import "../bootstraps/env.bootstrap";
import cloudinary from "../config/cloudinary.config";
import { UploadPresets } from "../consts/cloudinary.const";

type GenerateSignaturePayload = {
    params : {
        timestamp : number,
        upload_preset : UploadPresets,
        folder : string,
    }
}

const {CLOUDINARY_API_SECRET, CLOUDINARY_API_KEY, CLOUDINARY_CLOUD_NAME} =  process.env;

export const generateCloudinarySignature = (payload : GenerateSignaturePayload) : CloudinarySignaturePayload => {
    if(!CLOUDINARY_API_SECRET || !CLOUDINARY_API_KEY || !CLOUDINARY_CLOUD_NAME) {
        throw new Error("Something went wrong");
    }

    const signature = cloudinary.utils.api_sign_request(payload.params, CLOUDINARY_API_SECRET);

    return {
        timestamp : payload.params.timestamp,
        upload_preset : payload.params.upload_preset,
        folder : payload.params.folder,
        apiKey : CLOUDINARY_API_KEY,
        cloudName : CLOUDINARY_CLOUD_NAME,
        signature,
    }

}