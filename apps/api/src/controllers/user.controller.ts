import { Request, Response, NextFunction} from "express";
import { AppError } from "../errors/appError.error";
import { User } from "../models/user.model";
import * as userServices from "../services/user.service";
import { ReqBody } from "../types/request";
import { CreateUserProfileSchema } from "@connect/shared";

export const onboarding = async (req : ReqBody<CreateUserProfileSchema>, res : Response, next : NextFunction) => {
    try {
        const userId = req.userId;
    
        if(!userId) {
            throw new AppError(401, "UNAUTHORIZED", "Unauthorized");
        }
    
        const user = User.findById(userId);
    
        if(!user) {
            throw new AppError(404, "BAD_REQUEST", "Invalid ")
        }
    
        const {profileImagePublicId, profileImageUrl, name, username, bio} = req.body;

        await userServices.onboarding(userId, profileImageUrl, profileImagePublicId, name, username, bio);
    } catch (err) {
        next(err);
    }
}