import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validateData = (schema : z.ZodObject<any, any>) => {
    return (req : Request, res: Response, next : NextFunction) => {
        try {
            const parsed = schema.parse(req.body);

            req.body = parsed;

            next();
        } catch (err) {
            next(err);
        }
    }
}