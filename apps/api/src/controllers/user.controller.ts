import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError.error";
import * as userServices from "../services/user.service";
import { ReqBody } from "../types/request.type";
import { CreateUserProfileSchema, SUCCESS_RESPONSE_CODE, UpdateUserProfile, UserProfileDTO } from "@odiano/shared";
import { successResponseData } from "../utils/response.util";
import { UnauthorizedError } from "../errors/unauthorized.error";

export const onboarding = async (req: ReqBody<CreateUserProfileSchema>, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;

        if (!userId) {
            throw new UnauthorizedError();
        }

        await userServices.onboarding({ userId, userData: req.body });

        res.status(200).json(successResponseData(SUCCESS_RESPONSE_CODE.success, "Success"));
    } catch (err) {
        next(err);
    }
}

export const checkUsernameAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.query.username;

        if (!username || typeof username != "string") {
            throw new AppError(400, "BAD_REQUEST", "Username is missing");
        }

        const isAvailable = await userServices.checkUsernameAvailability(username);

        res.status(200).json(successResponseData(SUCCESS_RESPONSE_CODE.ok, "success", { available: isAvailable }));
    } catch (err) {
        next(err);
    }
}

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentUserId = req.userId;

        const username = String(req.params.username);

        const data = await userServices.getUserProfile(username, currentUserId);

        res.status(200).json(successResponseData<UserProfileDTO>(SUCCESS_RESPONSE_CODE.success, "Success", data))
    } catch (err) {
        next(err);
    }
}

export const updateProfile = async (req : ReqBody<UpdateUserProfile>, res : Response, next : NextFunction) => {
    const currentUserId = req.userId;
    const data = req.body;
    
    try {
        if(!currentUserId) {
            throw new UnauthorizedError();
        }

        await userServices.updateProfile(currentUserId, data);

        res.status(200).json(successResponseData(SUCCESS_RESPONSE_CODE.updated, "Updated"));
    } catch (err) {
        next(err);
    }
}