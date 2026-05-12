import {Request, Response, NextFunction} from "express";
import * as uploadServices from "../services/upload.service";
import { successResponseData } from "../utils/response.util";
import { CloudinarySignaturePayload, SUCCESS_RESPONSE_CODE } from "@connect/shared";
import { UPLOAD_PRESETS } from "../consts/cloudinary.const";

export const generateProfileSignature = (req : Request, res : Response, next : NextFunction) => {
    try {
        const timestamp = Math.floor(Date.now() / 1000);
        const signatureParams = {
            upload_preset : UPLOAD_PRESETS.profile,
            folder : "profile",
            timestamp,
        }

        const signaturePayload = uploadServices.generateCloudinarySignature({params : signatureParams})

        res.status(200).json(successResponseData<CloudinarySignaturePayload>(SUCCESS_RESPONSE_CODE.success, "success", signaturePayload));
    } catch (err) {
        next(err);
    }
} 