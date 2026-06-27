import { Request, Response, NextFunction } from "express";
import * as followingServices from "../services/following.service";
import { UnauthorizedError } from "../errors/unauthorized.error";
import { successResponseData } from "../utils/response.util";
import { SUCCESS_RESPONSE_CODE } from "@connect/shared";

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentUserId = req.userId;
        const { userId, followUserId } = req.body.data;

        if (!currentUserId) {
            throw new UnauthorizedError();
        }

        await followingServices.createFollowing(currentUserId, userId, followUserId);

        res.status(201).json(successResponseData(SUCCESS_RESPONSE_CODE.created, "Created"));
    } catch (err) {
        next(err)
    }
}

export const deleteFollowing = async(req : Request, res: Response, next : NextFunction) => {
    try {
        const currentUserId = req.userId;
        const {userId, followUserId} = req.body;

        if(!currentUserId) {
            throw new UnauthorizedError();
        }

        await followingServices.deleteFollowing(currentUserId, userId, followUserId);
        
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