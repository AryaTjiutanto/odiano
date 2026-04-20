import {Request, Response, NextFunction} from "express";
import { errorResponseData } from "../utils/response.util";
import { AppError } from "../errors/appError.error";

export const requireGuest = (req : Request, res: Response, next : NextFunction) => {
    const authorization = req.headers.authorization;

    if(authorization) {
       throw new AppError(403, "FORBIDDEN", "You already authenticated");
    }

    next();
}