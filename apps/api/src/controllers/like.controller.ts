import { Request, Response, NextFunction } from "express";
import * as likeServices from "../services/like.service.js";
import { UnauthorizedError } from "../errors/unauthorized.error.js";
import { AppError } from "../errors/appError.error.js";
import { ERROR_RESPONSE_CODE, SUCCESS_RESPONSE_CODE } from "@odiano/shared";
import { successResponseData } from "../utils/response.util.js";

export const createPostLike = async (req: Request, res: Response, next: NextFunction) => {
    const currentUserId = req.userId;
    const {postId} = req.params;

    try {
        if(!currentUserId) {
            throw new UnauthorizedError();
        }

        if(!postId) {
            throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Something is missing");
        }

        await likeServices.createPostLike(currentUserId, String(postId));

        res.status(201).json(successResponseData(SUCCESS_RESPONSE_CODE.created, "success"));
    } catch (err) {
        next(err)
    }
}

export const deletePostLike = async (req : Request, res : Response, next : NextFunction) => {
    const currentUserId = req.userId;
    const {postId} = req.params;

    try {
        if(!currentUserId) {
            throw new UnauthorizedError();
        }

        if(!postId) {
            throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Something is missing");
        }

        await likeServices.deletePostLike(currentUserId, String(postId));

        res.status(200).json(successResponseData(SUCCESS_RESPONSE_CODE.ok, "OK"));
    } catch (err) {
        next(err);
    }
}