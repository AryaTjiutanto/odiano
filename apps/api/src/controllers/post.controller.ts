import {Request, Response, NextFunction} from "express";

export const create = (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (err) {
        next(err);
    }
}