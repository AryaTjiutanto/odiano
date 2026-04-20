import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { verifyRefreshToken } from "../libs/auth/jwt";
import { AppError } from "../errors/appError.error";
import { RefreshToken } from "../models/refreshToken.mode";

export const requireRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.["refresh_token"];

        if (!token) {
            throw new AppError(401, "UNAUTHORIZED", "Unauthorized");
        }

        const decoded = verifyRefreshToken(token) as { id: string, tokenId: string };

        req.userId = decoded.id;
        req.tokenId = decoded.tokenId;
        next();
    } catch (err) {
        next(err);
    }
}