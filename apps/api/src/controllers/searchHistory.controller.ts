import { Request, Response, NextFunction } from "express";
import * as searchHistoryService from "../services/searchHistory.service";
import { successResponseData } from "../utils/response.util";
import { SearchHistoryDTO, SUCCESS_RESPONSE_CODE } from "@connect/shared";
import { UnauthorizedError } from "../errors/unauthorized.error";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    const currentUserId = req.userId;
    
    try {
        if(!currentUserId) {
            throw new UnauthorizedError();
        }
        
        const result = await searchHistoryService.getSearchHistory(currentUserId);

        res.status(200).json(successResponseData<SearchHistoryDTO[]>(SUCCESS_RESPONSE_CODE.ok, "ok", result))
    } catch (err) {
        next(err);
    }
}

export const record = async (req : Request, res : Response, next : NextFunction) => {
    const userId = req.userId;
    const {targetId, type, keyword} = req.body;

    if(!userId) return;

    try {
        await searchHistoryService.recordHistory(userId, type, targetId, keyword);

        res.status(201).json(successResponseData(SUCCESS_RESPONSE_CODE.created, "Search History recorded"));
    } catch (err) {
        next(err);
    }
}