import { Request, Response, NextFunction } from "express";
import { verifyRefreshToken } from "../libs/auth/auth.token.js";
import { UnauthorizedError } from "../errors/unauthorized.error.js";
import { validateRequestSession } from "../services/session.service.js";

export const requireRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.["refresh_token"];

        if (!token) {
            throw new UnauthorizedError();
        }

        const decoded = verifyRefreshToken(token);

        // validate session
        await validateRequestSession(res, decoded.userId, decoded.sessionId);

        // pass data
        req.userId = decoded.userId;
        req.tokenId = decoded.tokenId;
        req.sessionId = decoded.sessionId;
        next();
    } catch (err) {
        next(err);
    }
}