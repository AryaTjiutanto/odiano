import {NextFunction, Request, Response} from "express";
import { AppError } from "../errors/appError.error.js";
import { ERROR_RESPONSE_CODE } from "@odiano/shared";
import { verifyRequestVerificationToken } from "../libs/request-verification/verification.token.js";
import REQUEST_HEADERS from "@odiano/shared/dist/request/request.const.js";

const requireRequestVerificationToken = (req : Request, res : Response, next : NextFunction) => {
    const token = req.headers[REQUEST_HEADERS.REQUEST_VERIFICATION_TOKEN];

    if(!token) {
        throw new AppError(403, ERROR_RESPONSE_CODE.noRequestVerificationToken, "Something is missing!");
    }

    const decoded = verifyRequestVerificationToken(String(token));

    if(decoded.expireAt < new Date()) {
        throw new AppError(403, ERROR_RESPONSE_CODE.invalidRequestVerificationToken, "Verification challenge expired");
    }

    req.verificationChallengeId = decoded.verificationChallengeId;

    next();
}

export default requireRequestVerificationToken;