import { Request, Response, NextFunction } from "express";
import * as followingServices from "../services/following.service";
import { UnauthorizedError } from "../errors/unauthorized.error";
import { successResponseData } from "../utils/response.util";
import { ERROR_RESPONSE_CODE, SUCCESS_RESPONSE_CODE } from "@odiano/shared";
import { AppError } from "../errors/appError.error";

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentUserId = req.userId;
        const { followUserId } = req.body.data;

        if (!currentUserId) {
            throw new UnauthorizedError();
        }

        if(!followUserId) {
            throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Something is missing");
        }

        await followingServices.createFollowing(currentUserId, followUserId);

        res.status(201).json(successResponseData(SUCCESS_RESPONSE_CODE.created, "Created"));
    } catch (err) {
        next(err)
    }
}

export const deleteFollowing = async(req : Request, res: Response, next : NextFunction) => {
    try {
        const currentUserId = req.userId;
        const {followUserId} = req.body;

        if(!currentUserId) {
            throw new UnauthorizedError();
        }

        if(!followUserId) {
            throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Something is missing");
        }

        await followingServices.deleteFollowing(currentUserId, followUserId);
        
        res.status(204).json(successResponseData(SUCCESS_RESPONSE_CODE.deleted, "Deleted"));
    } catch(err) {
        next(err);
    }
}

export const checkFollowing = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const currentUserId = req.userId;
        const followUserId = String(req.params.userId);

        if(!currentUserId) {
            throw new UnauthorizedError();
        }

        const isFollowing = await followingServices.isFollowing(currentUserId, followUserId);

        res.status(200).json(successResponseData(SUCCESS_RESPONSE_CODE.ok,"ok", {isFollowing}));
    } catch (err) {
        next(err);
    }
}