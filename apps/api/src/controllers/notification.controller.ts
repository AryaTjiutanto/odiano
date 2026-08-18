import { Request, Response, NextFunction } from "express";
import * as notificationService from "../services/notification.service";
import { UnauthorizedError } from "../errors/unauthorized.error";
import { successResponseData } from "../utils/response.util";
import { ERROR_RESPONSE_CODE, InfiniteQuery, NOTIFICATION_READ_STATUS, NotificationDTO, SUCCESS_RESPONSE_CODE } from "@odiano/shared";
import { AppError } from "../errors/appError.error";

export const get = async (req : Request, res : Response, next : NextFunction) => {
    const currentUserId = req.userId;
    const cursor = req.query.cursor;
    const readStatus = req.query.readStatus ?? NOTIFICATION_READ_STATUS.READ;

    try {
        if(!currentUserId) {
            throw new UnauthorizedError();
        }

        const isRead = readStatus == NOTIFICATION_READ_STATUS.READ;

        const notifications = await notificationService.get(currentUserId, cursor && String(cursor), isRead);

        res.status(200).json(successResponseData<InfiniteQuery<NotificationDTO[]>>(SUCCESS_RESPONSE_CODE.success, "success", notifications))
    } catch (err) {
        next(err)
    }
}

export const getUnreadCount = async (req : Request, res : Response, next : NextFunction) => {
    const currentUserId = req.userId;

    try {
        if(!currentUserId) {
            throw new UnauthorizedError();
        }

        const result = await notificationService.getUnreadCount(currentUserId);

        res.status(200).json(successResponseData<number>(SUCCESS_RESPONSE_CODE.success, "success", result))
    } catch (err) {
        next(err)
    }
}

export const updateReadStatus = async (req : Request, res : Response, next : NextFunction) => {
    const currentUserId = req.userId;
    const notificationId = req.params.notificationId;

    try {
        if(!currentUserId) {
            throw new UnauthorizedError();
        }

        if(!notificationId) {
            throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Something is missing");
        }

        await notificationService.updateReadStatus(currentUserId, String(notificationId));

        res.status(207).json(successResponseData(SUCCESS_RESPONSE_CODE.updated, "Update successfully"))
    } catch(err) {
        next(err);
    }
}