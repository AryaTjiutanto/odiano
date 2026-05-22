import { Response, NextFunction } from "express";
import * as postServices from "../services/post.service";
import { ReqBody } from "../types/request";
import { CreatePostSchema, PostPublicId } from "@connect/shared";
import { successResponseData } from "../utils/response.util";

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