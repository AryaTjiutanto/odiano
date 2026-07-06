import { Request, Response, NextFunction } from "express";
import { getSearchHistory } from "../services/searchHistory.service";
import { successResponseData } from "../utils/response.util";
import { searchHistoryDTO, SUCCESS_RESPONSE_CODE } from "@connect/shared";

export const get = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await getSearchHistory();

        res.status(200).json(successResponseData<searchHistoryDTO[]>(SUCCESS_RESPONSE_CODE.ok, "ok", result))
    } catch (err) {
        next(err);
    }
}