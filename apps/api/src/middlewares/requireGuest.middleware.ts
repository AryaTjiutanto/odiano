import {Request, Response, NextFunction} from "express";
import { errorResponseData } from "../utils/response.util.js";
import { AppError } from "../errors/appError.error.js";
import { ERROR_RESPONSE_CODE } from "@odiano/shared";

export const requireGuest = (req : Request, res: Response, next : NextFunction) => {
    const authorization = req.headers.authorization;

    if(authorization) {
       throw new AppError(403, ERROR_RESPONSE_CODE.forbidden, "You already authenticated");
    }

    next();
}