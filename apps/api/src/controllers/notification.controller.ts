import { Request, Response, NextFunction } from "express";
import * as notificationService from "../services/notification.service";
import { UnauthorizedError } from "../errors/unauthorized.error";
import { successResponseData } from "../utils/response.util";
import { InfiniteQuery, NotificationDTO, SUCCESS_RESPONSE_CODE } from "@connect/shared";

export const get = async (req : Request, res : Response, next : NextFunction) => {
    const currentUserId = req.userId;
    const cursor = req.query.cursor;

    try {
        if(!currentUserId) {
            throw new UnauthorizedError();
        }

        const notifications = await notificationService.get(currentUserId, cursor && String(cursor));

        res.status(200).json(successResponseData<InfiniteQuery<NotificationDTO[]>>(SUCCESS_RESPONSE_CODE.success, "success", notifications))
    } catch (err) {
        next(err)
    }
}