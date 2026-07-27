import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../libs/auth/auth.token";
import { AppError } from "../errors/appError.error";
import { ERROR_RESPONSE_CODE } from "@odiano/shared";

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            return next();
        }

        const [prefix, token] = authorization.split(" ");

        if (prefix !== "Bearer" || !token) {
            throw new AppError(401, ERROR_RESPONSE_CODE.unauthorized, "Invalid Authorization");
        }
        const decoded = verifyAccessToken(token);

        req.userId = decoded.userId;
        next();
    } catch (err) {
        next(err);
    }
}

export default optionalAuth;