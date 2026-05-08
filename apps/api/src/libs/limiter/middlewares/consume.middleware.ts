import {NextFunction, Request, Response} from "express";
import { AppError } from "../../../errors/appError.error";

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
        } catch {
            next(new AppError(429, "TOO_MANY_REQUESTS", "Too many request"));
        }
    }
}