import { Request, Response, NextFunction } from "express";
import * as uploadServices from "../services/upload.service";
import { successResponseData } from "../utils/response.util";
import { CloudinarySignaturePayload, SUCCESS_RESPONSE_CODE } from "@connect/shared";
import { UPLOAD_PRESETS } from "../consts/cloudinary.const";
import logger from "../libs/log/logger";

export const generateProfileSignature = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    try {
        const timestamp = Math.floor(Date.now() / 1000);

        const signaturePayload = uploadServices.generateCloudinarySignature({
            params: {
                upload_preset: UPLOAD_PRESETS.PROFILE,
                folder: `temp/user/${userId ?? "anonymous"}/profile`,
                timestamp,
            }
        })

        res.status(200).json(successResponseData<CloudinarySignaturePayload>(SUCCESS_RESPONSE_CODE.success, "success", signaturePayload));
    } catch (err) {
        next(err);
    }
}

export const generateCoverSignature = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    try {
        const timestamp = Math.floor(Date.now() / 1000);

        const signaturePayload = uploadServices.generateCloudinarySignature({
            params: {
                timestamp,
                folder: `temp/user/${userId}/cover`,
                upload_preset: UPLOAD_PRESETS.COVER,
            }
        })

        res.status(200).json(successResponseData<CloudinarySignaturePayload>(SUCCESS_RESPONSE_CODE.success, "success", signaturePayload));
    } catch (err) {
        next(err);
    }
}