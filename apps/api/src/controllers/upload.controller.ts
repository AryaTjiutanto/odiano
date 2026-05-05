import {Request, Response, NextFunction} from "express";
import * as uploadServices from "../services/upload.service";
import { successResponseData } from "../utils/response.util";
import { SignaturePayload } from "../types/signature.type";

export const generateProfileSignature = (req : Request, res : Response, next : NextFunction) => {
    try {
        const timestamp = Math.floor(Date.now() / 1000);
        const signatureParams = {
            upload_preset : "profile_upload",
            timestamp,
        }

        const signaturePayload = uploadServices.generateCloudinarySignature({params : signatureParams})

        res.status(200).json(successResponseData("SUCCESS", "success", {
            timestamp,
            signature : signaturePayload.signature,
            cloudName : signaturePayload.cloudName,
            apiKey : signaturePayload.apiKey,
        }));
    } catch (err) {
        next(err);
    }
} 