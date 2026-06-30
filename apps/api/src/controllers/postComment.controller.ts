import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError.error";
import { CreatePostCommentSchema, ERROR_RESPONSE_CODE, InfiniteQuery, PostCommentDTO, SUCCESS_RESPONSE_CODE } from "@connect/shared";
import * as postCommentService from "../services/postComment.service";
import { successResponseData } from "../utils/response.util";
import { UnauthorizedError } from "../errors/unauthorized.error";
import { ReqBody } from "../types/request.type";

export const createComment = async (req: ReqBody<CreatePostCommentSchema>, res: Response, next: NextFunction) => {
    const currentUserId = req.userId;
    const { content, postId, parentId, depth } = req.body;

    try {
        if (!currentUserId) {
            throw new UnauthorizedError();
        }

        if (!content || !postId || depth === null || depth === undefined) {
            throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Something is missing");
        }

        await postCommentService.create({ content, authorId: currentUserId, postId, parentId, depth });

        res.status(200).json(successResponseData(SUCCESS_RESPONSE_CODE.created, "created"));
    } catch (err) {
        next(err);
    }
}

export const getComments = async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const userId = req.userId;
    const { cursor } = req.query;

    try {
        if (!postId) {
            throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Something is missing");
        }

        const params = {
            cursor: cursor && String(cursor),
            postId: String(postId),
            userId: userId && String(userId)
        }
        
        const comments = await postCommentService.get(params);

        res.status(200).json(successResponseData<InfiniteQuery<PostCommentDTO[]>>(SUCCESS_RESPONSE_CODE.success, "success", comments));
    } catch (err) {
        next(err);
    }
}

export const getCurrentUserComments = async (req: Request, res: Response, next : NextFunction) => {
    const { postId } = req.params;
    const userId = req.userId;
    
    try {
        if(!postId) {
            throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Something is missing");
        }

        if(!userId) {
            throw new UnauthorizedError();
        }

        const comments = await postCommentService.getCurrentUserComments(userId, String(postId));

        res.status(200).json(successResponseData<PostCommentDTO[]>(SUCCESS_RESPONSE_CODE.success, "success", comments));
    } catch (err) {
        next(err);
    }
}