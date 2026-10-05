import {NextFunction, Request, Response} from "express";
import { AppError } from "../../../errors/appError.error.js";
import { TooManyRequestError } from "@odiano/shared";

const defaultKeyGenerator = (req : Request) => {
    const apiKey = req?.ip || "anonymous";

    return apiKey;
}

export const consume = (limiter : any, keyGenerator : (req : Request) => string = defaultKeyGenerator) => {
    return async (req : Request, res : Response, next : NextFunction) => {
        try {
            const key = keyGenerator(req);
            await limiter.consume(key);

            next();
        } catch (error : any) {
            next(new AppError(429, "TOO_MANY_REQUESTS", "Too many request", {timeLeftMs : error.msBeforeNext} as TooManyRequestError));
        }
    }
}