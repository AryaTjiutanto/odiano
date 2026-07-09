import { Request, Response, NextFunction } from "express";
import * as searchHistoryService from "../services/searchHistory.service";
import { successResponseData } from "../utils/response.util";
import { ERROR_RESPONSE_CODE, SearchHistoryDTO, SUCCESS_RESPONSE_CODE } from "@connect/shared";
import { UnauthorizedError } from "../errors/unauthorized.error";
import { AppError } from "../errors/appError.error";
import logger from "../libs/log/logger";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const currentUserId = req.userId;

    try {
        if (!currentUserId) {
            throw new UnauthorizedError();
        }

        const result = await searchHistoryService.getSearchHistory(currentUserId);

        res.status(200).json(successResponseData<SearchHistoryDTO[]>(SUCCESS_RESPONSE_CODE.ok, "ok", result))
    } catch (err) {
        next(err);
    }
}

export const record = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const { targetId, type, keyword } = req.body;

    if (!userId) return;

    try {
        const searchHistoryId = await searchHistoryService.recordHistory(userId, type, targetId, keyword);

        res.status(201).json(successResponseData(SUCCESS_RESPONSE_CODE.created, "Search History recorded", {id : searchHistoryId}));
    } catch (err) {
        next(err);
    }
}

export const deleteHistory = async (req: Request, res: Response, next: NextFunction) => {
    const currentUserId = req.userId;
    const { id } = req.params;

    try {
        if (!currentUserId) {
            throw new UnauthorizedError();
        }

        if(!id) {
            throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Something is missing")
        }

        await searchHistoryService.deleteHistory(currentUserId, String(id));

        res.status(204).json(successResponseData(SUCCESS_RESPONSE_CODE.deleted, "Deleted successfully"));
    } catch (err) {
        next(err);
    }
}

export const deleteAllHistory = async (req: Request, res : Response, next : NextFunction) => {
    const currentUserId = req.userId;

    try {
        if(!currentUserId) {
            throw new UnauthorizedError();
        }

        await searchHistoryService.deleteAllHistory(currentUserId);

        res.status(204).json(successResponseData(SUCCESS_RESPONSE_CODE.deleted, "Deleted successfully"));
    } catch (err) {
        next(err);
    }
}