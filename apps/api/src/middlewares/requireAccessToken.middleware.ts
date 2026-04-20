import { Request, Response, NextFunction } from "express";
import { errorResponseData } from "../utils/response.util";
import { verifyAccessToken } from "../libs/auth/jwt";
import { AppError } from "../errors/appError.error";

export const requireAccessToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            throw new AppError(401, "UNAUTHORIZED", "Unauthorized");
        }

        const [prefix, token] = authorization.split(" ");

        if (prefix !== "Bearer" || !token) {
            throw new AppError(401, "UNAUTHORIZED", "Invalid Authorization");
        }
        const decoded = verifyAccessToken(token) as { id: string };

        req.userId = decoded.id;
        next();
    } catch (err) {
        next(err);
    }
}

export default requireAccessToken;