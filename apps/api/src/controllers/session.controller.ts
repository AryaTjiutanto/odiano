import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors/unauthorized.error.js";
import * as sessionService from "../services/session.service.js";
import { successResponseData } from "../utils/response.util.js";
import { ERROR_RESPONSE_CODE, SessionsDTO, SUCCESS_RESPONSE_CODE } from "@odiano/shared";
import { AppError } from "../errors/appError.error.js";

export const getActiveSessions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, sessionId } = req;

        if (!userId || !sessionId) {
            throw new UnauthorizedError();
        }

        const data = await sessionService.getActiveSession(userId, sessionId);

        res.status(200).json(successResponseData<SessionsDTO>(SUCCESS_RESPONSE_CODE.success, "success", data));
    } catch (err) {
        next(err);
    }
};

export const revokeSession = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const userId = req.userId;
        const sessionId = req.params.id;

        if(!userId) {
            throw new UnauthorizedError();
        }

        await sessionService.revokeSession(userId, sessionId ? String(sessionId) : null);

        res.status(200).json(successResponseData(SUCCESS_RESPONSE_CODE.success, "logout successfully"));
    } catch (err) {
        next(err);
    }
}

export const resendSessionVerification = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const userAgent = req.headers["user-agent"] || null;
        const verificationChallengeId = req.verificationChallengeId;

        if(!verificationChallengeId) {
            throw new AppError(403, ERROR_RESPONSE_CODE.noRequestVerificationToken, "Access denied");
        }

        await sessionService.resendSessionVerification(verificationChallengeId, userAgent);
    } catch (err) {
        next(err);
    }
}