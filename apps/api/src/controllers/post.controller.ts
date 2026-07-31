import { Request, Response, NextFunction } from "express";
import * as postServices from "../services/post.service";
import { ReqBody } from "../types/request.type";
import { CreatePostSchema, InfiniteQuery, PostDTO, PostPublicId, SUCCESS_RESPONSE_CODE } from "@odiano/shared";
import { successResponseData } from "../utils/response.util";
import { UnauthorizedError } from "../errors/unauthorized.error";

export const index = async(req: Request, res: Response, next: NextFunction) => {
    const cursor = typeof req.query.cursor == "string" ? req.query.cursor : null;
    const currentUserId = req.userId;

    try{
        const data = await postServices.listPosts(currentUserId, cursor);

        res.status(200).json(successResponseData<InfiniteQuery<PostDTO[]>>(SUCCESS_RESPONSE_CODE.success, "Success", data));
    } catch(err) {
        next(err);
    }
}

export const show = async(req: Request, res : Response, next : NextFunction) => {
    const postPublicId = String(req.params.postPublicId);
    const currentUserId = req.userId;

    try {
        if(!postPublicId) {
            throw new Error("public id is missing or not valid");
        }

        const post = await postServices.getPost(currentUserId, postPublicId);

        res.status(200).json(successResponseData(SUCCESS_RESPONSE_CODE.success, "success", post));
    } catch (err) {
        next(err);
    }
}

export const getUserPosts = async (req : Request, res : Response, next : NextFunction) => {
    const cursor = typeof req.query.cursor == "string" ? req.query.cursor : null;
    const currentUserId = req.userId;

    try {
        const username = String(req.params.username);

        const data = await postServices.getUserPosts(currentUserId, username, cursor);

        res.status(200).json(successResponseData<InfiniteQuery<PostDTO[]>>(SUCCESS_RESPONSE_CODE.success, "Success", data));
    } catch(err) {
        next(err);
    }
}

export const create = async (req: ReqBody<CreatePostSchema>, res: Response, next: NextFunction) => {
    const userId = req.userId;

    try {
        if(!userId) {
            throw new Error("User id not found");
        }

        const result = await postServices.create(userId, req.body);

        res.status(200).json(successResponseData<PostPublicId>("CREATED", "Created successfully", {publicId : result.publicId}));
    } catch (err) {
        next(err);
    }
}

export const deletePost = async (req : Request, res : Response, next : NextFunction) => {
    const currentUserId = req.userId;
    const postId = String(req.params.postId);

    try {
        if(!currentUserId) {
            throw new UnauthorizedError();
        }

        await postServices.deletePost(currentUserId, postId);

        res.status(204).json(successResponseData(SUCCESS_RESPONSE_CODE.deleted, "Success"));
    } catch (err) {
        next(err);
    }
}