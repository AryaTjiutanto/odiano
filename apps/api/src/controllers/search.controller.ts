import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError.error";
import { ERROR_RESPONSE_CODE, InfiniteQuery, PostDTO, SearchSuggestionDTO, SUCCESS_RESPONSE_CODE, UserSummaryDTO } from "@odiano/shared";
import * as searchService from "../services/search.service";
import { successResponseData } from "../utils/response.util";
import { UnauthorizedError } from "../errors/unauthorized.error";

export const getPostsSearchResult = async (req : Request, res : Response, next : NextFunction) => {
    const currentUserId = req.userId;
    const {q, onlyMedia, cursor} = req.query;
    
    try {
        if(!currentUserId) {
            throw new UnauthorizedError();
        }

        const result = await searchService.getPostsSearchResult(String(q), cursor ? String(cursor) : undefined, currentUserId, {
            onlyMedia: !!onlyMedia,
        });

        res.status(200).json(successResponseData<InfiniteQuery<PostDTO[]>>(SUCCESS_RESPONSE_CODE.ok, "ok", result));
    } catch(err) {
        next(err);
    }
}

export const getUsersSearchResult = async (req : Request, res : Response, next : NextFunction) => {
    const {q} = req.query;

    try {
        const result = await searchService.getUsersSearchResult(String(q));

        res.status(200).json(successResponseData<UserSummaryDTO[]>(SUCCESS_RESPONSE_CODE.ok, "ok", result));
    } catch(err) {
        next(err);
    }
}

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