import { Request, Response, NextFunction } from "express";
import * as notificationService from "../services/notification.service";
import { UnauthorizedError } from "../errors/unauthorized.error";

export const get = async (req : Request, res : Response, next : NextFunction) => {
    const currentUserId = req.userId;
    const cursor = req.query.cursor;

    try {
        if(!currentUserId) {
            throw new UnauthorizedError();
        }

        const notifications = await notificationService.get(currentUserId, cursor && String(cursor));
    } catch (err) {
        next(err)
    }
}