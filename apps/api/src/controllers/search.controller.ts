import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError.error";
import { ERROR_RESPONSE_CODE, SearchSuggestionDTO, SUCCESS_RESPONSE_CODE } from "@odiano/shared";
import * as searchService from "../services/search.service";
import { successResponseData } from "../utils/response.util";
import logger from "../libs/log/logger";

export const getSuggestions = async (req : Request, res : Response, next : NextFunction) => {
    const {q} = req.query;
    
    try {
        if(!q) {
            throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Search query is required");
        }
        const result = await searchService.getSuggestions(String(q));

        res.status(200).json(successResponseData<SearchSuggestionDTO[]>(SUCCESS_RESPONSE_CODE.ok, "ok", result));
    } catch(err) {
        next(err);
    }
}