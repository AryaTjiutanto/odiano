import { Request, Response, NextFunction } from "express";
import { verifyRefreshToken } from "../libs/auth/auth.token.js";
import { UnauthorizedError } from "../errors/unauthorized.error.js";
import { checkIsSessionValid } from "../services/session.service.js";
import { AUTH_TOKEN, ERROR_RESPONSE_CODE } from "@odiano/shared";
import { AppError } from "../errors/appError.error.js";
import { authCookieOptions } from "../libs/auth/auth.cookie.js";

export const requireRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.["refresh_token"];

        if (!token) {
            throw new UnauthorizedError();
        }

        const decoded = verifyRefreshToken(token);

        // check session
        const isSessionValid = await checkIsSessionValid(decoded.userId, decoded.sessionId);

        if (!isSessionValid) {
            res.clearCookie(AUTH_TOKEN.REFRESH, authCookieOptions());
            throw new AppError(401, ERROR_RESPONSE_CODE.invalidSession, "Invalid session");
        }

        // pass data
        req.userId = decoded.userId;
        req.tokenId = decoded.tokenId;
        req.sessionId = decoded.sessionId;
        next();
    } catch (err) {
        next(err);
    }
}