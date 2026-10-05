import { Request, Response, NextFunction } from "express";
import { verifyRefreshToken } from "../libs/auth/auth.token.js";
import { UnauthorizedError } from "../errors/unauthorized.error.js";

export const requireRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.["refresh_token"];

        if (!token) {
            throw new UnauthorizedError();
        }

        const decoded = verifyRefreshToken(token);

        req.userId = decoded.userId;
        req.tokenId = decoded.tokenId;
        next();
    } catch (err) {
        next(err);
    }
}