import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validateData = (
    schema: z.ZodTypeAny,
    via: "body" | "params" | "query" = "body"
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = schema.parse(req[via]);

            if (via === "body") {
                req.body = parsed;
            }
            
            next();
        } catch (err) {
            next(err);
        }
    };
};