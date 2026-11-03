import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../libs/auth/auth.token.js";
import { AppError } from "../errors/appError.error.js";
import { UnauthorizedError } from "../errors/unauthorized.error.js";
import { AUTH_TOKEN, ERROR_RESPONSE_CODE } from "@odiano/shared";
import { checkIsSessionValid } from "../services/session.service.js";
import { authCookieOptions } from "../libs/auth/auth.cookie.js";

export const requireAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            throw new UnauthorizedError();
        }

        const [prefix, token] = authorization.split(" ");

        if (prefix !== "Bearer" || !token) {
            throw new AppError(401, ERROR_RESPONSE_CODE.unauthorized, "Invalid Authorization");
        }
        const decoded = verifyAccessToken(token);

        // check session
        const isSessionValid = await checkIsSessionValid(decoded.userId, decoded.sessionId);

        if(!isSessionValid) {
            res.clearCookie(AUTH_TOKEN.REFRESH, authCookieOptions());
            throw new AppError(401, ERROR_RESPONSE_CODE.invalidSession, "Invalid session");
        }

        // pass data
        req.userId = decoded.userId;
        req.sessionId = decoded.sessionId;
        next();
    } catch (err) {
        next(err);
    }
}

export default requireAccessToken;