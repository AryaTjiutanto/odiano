import { Request, Response, NextFunction } from "express";
import * as searchHistoryService from "../services/searchHistory.service";
import { successResponseData } from "../utils/response.util";
import { searchHistoryDTO, SUCCESS_RESPONSE_CODE } from "@connect/shared";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await searchHistoryService.getSearchHistory();

        res.status(200).json(successResponseData<searchHistoryDTO[]>(SUCCESS_RESPONSE_CODE.ok, "ok", result))
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
    } catch (err) {
        next(err);
    }
}