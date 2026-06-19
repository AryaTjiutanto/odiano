import {Request, Response, NextFunction} from "express";
import { AppError } from "../errors/appError.error";
import { ERROR_RESPONSE_CODE, SUCCESS_RESPONSE_CODE } from "@connect/shared";
import * as postCommentService from "../services/postComment.service";
import { successResponseData } from "../utils/response.util";
import { UnauthorizedError } from "../errors/unauthorized.error";

export const create = async (req : Request, res : Response, next : NextFunction) => {
    const currentUserId = req.userId;
    const {content, postId, parentId, depth} = req.body;
    
    try {
        if(!currentUserId) {
            throw new UnauthorizedError();
        }

        if(!content || !postId || !parentId || !depth) {
            throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Something is missing");
        }

        await postCommentService.create({content, ownerId : currentUserId, postId, parentId, depth});

        res.status(200).json(successResponseData(SUCCESS_RESPONSE_CODE.created, "created"));
    } catch(err) {
        next(err);
    }
}