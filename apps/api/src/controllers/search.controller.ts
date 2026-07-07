import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError.error";
import { ERROR_RESPONSE_CODE, SearchDTO, SUCCESS_RESPONSE_CODE } from "@connect/shared";
import * as searchService from "../services/search.service";
import { successResponseData } from "../utils/response.util";
import { searchQuerySchema } from "../validations/search.validation";

export const get = async (req : Request, res : Response, next : NextFunction) => {
    const {q} = req.query;
    
    try {
        if(!q) {
            throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Search query is required");
        }

        const result = await searchService.get(String(q));

        res.status(200).json(successResponseData<SearchDTO>(SUCCESS_RESPONSE_CODE.ok, "ok", result));
    } catch(err) {
        next(err);
    }
}