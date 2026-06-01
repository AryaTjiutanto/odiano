import { Request, Response, NextFunction } from "express";
import * as postServices from "../services/post.service";
import { ReqBody } from "../types/request";
import { CreatePostSchema, InfiniteQuery, PostDTO, PostPublicId, SUCCESS_RESPONSE_CODE } from "@connect/shared";
import { successResponseData } from "../utils/response.util";

export const index = async(req: Request, res: Response, next: NextFunction) => {
    const cursor = typeof req.query.cursor == "string" ? req.query.cursor : null;

    try{
        const data = await postServices.listPosts(cursor);

        res.status(200).json(successResponseData<InfiniteQuery<PostDTO[]>>(SUCCESS_RESPONSE_CODE.success, "Success", data));
    } catch(err) {
        next(err);
    }
}

export const show = async(req: Request, res : Response, next : NextFunction) => {
    const postPublicId = String(req.params.postPublicId);

    try {
        if(!postPublicId) {
            throw new Error("public id is missing or not valid");
        }

        const post = await postServices.getPost(postPublicId);

        res.status(200).json(successResponseData(SUCCESS_RESPONSE_CODE.success, "success", post));
    } catch (err) {
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