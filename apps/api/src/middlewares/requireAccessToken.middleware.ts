import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../libs/auth/auth.token.js";
import { AppError } from "../errors/appError.error.js";
import { UnauthorizedError } from "../errors/unauthorized.error.js";
import { ERROR_RESPONSE_CODE } from "@odiano/shared";
import { validateRequestSession } from "../services/session.service.js";

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

        // validate session
        await validateRequestSession(res, decoded.userId, decoded.sessionId);

        // pass data
        req.userId = decoded.userId;
        req.sessionId = decoded.sessionId;
        next();
    } catch (err) {
        next(err);
    }
}

export default requireAccessToken;