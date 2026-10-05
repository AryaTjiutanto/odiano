import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../libs/auth/auth.token.js";
import { AppError } from "../errors/appError.error.js";
import { UnauthorizedError } from "../errors/unauthorized.error.js";
import { ERROR_RESPONSE_CODE } from "@odiano/shared";

export const requireAccessToken = (req: Request, res: Response, next: NextFunction) => {
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

        req.userId = decoded.userId;
        next();
    } catch (err) {
        next(err);
    }
}

export default requireAccessToken;