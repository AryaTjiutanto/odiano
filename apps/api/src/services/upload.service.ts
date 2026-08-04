import { CloudinarySignaturePayload, ERROR_RESPONSE_CODE, POST_MAX_MEDIA } from "@odiano/shared";
import "../bootstraps/env.bootstrap";
import cloudinary from "../config/cloudinary.config";
import { UPLOAD_PRESETS, UploadPresets } from "../consts/cloudinary.const";
import { AppError } from "../errors/appError.error";

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

export const generatePostMediaSignature = (total : number | null | undefined, currentUserId : string) : CloudinarySignaturePayload[] => {
    if(!total) {
        throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Total is required");
    }

    if(total > POST_MAX_MEDIA) {
        throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, `Total cannot be greater than ${POST_MAX_MEDIA}`);
    }

    const signaturePayload = Array.from(
        { length: total },
        (_, index) => {
            return generateCloudinarySignature({
                params: {
                    timestamp : Math.floor(Date.now() / 1000),
                    upload_preset : UPLOAD_PRESETS.POST_MEDIA,
                    folder : `temp/${currentUserId}/post/media/${index}`,
                }
            })
        }
    );

    return signaturePayload;
}