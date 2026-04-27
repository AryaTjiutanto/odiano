import { Request, Response, NextFunction } from "express";
import { errorResponseData } from "../utils/response.util";
import { verifyAccessToken } from "../libs/auth/auth.token";
import { AppError } from "../errors/appError.error";
import { UnauthorizedError } from "../errors/unauthorized.error";

export const requireAccessToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            throw new UnauthorizedError();
        }

        const [prefix, token] = authorization.split(" ");

        if (prefix !== "Bearer" || !token) {
            throw new AppError(401, "UNAUTHORIZED", "Invalid Authorization");
        }
        const decoded = verifyAccessToken(token);

        req.userId = decoded.userId;
        next();
    } catch (err) {
        next(err);
    }
}

export default requireAccessToken;