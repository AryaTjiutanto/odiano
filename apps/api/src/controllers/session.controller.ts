import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors/unauthorized.error.js";
import * as SessionService from "../services/session.service.js";
import { successResponseData } from "../utils/response.util.js";
import { SessionsDTO, SUCCESS_RESPONSE_CODE } from "@odiano/shared";

export const getActiveSessions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, sessionId } = req;

        if (!userId || !sessionId) {
            throw new UnauthorizedError();
        }

        const data = await SessionService.getActiveSession(userId, sessionId);

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

        await SessionService.revokeSession(userId, sessionId ? String(sessionId) : null);

        res.status(200).json(successResponseData(SUCCESS_RESPONSE_CODE.success, "logout successfully"));
    } catch (err) {
        next(err);
    }
}