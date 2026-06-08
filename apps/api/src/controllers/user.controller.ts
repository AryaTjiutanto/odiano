import { Request, Response, NextFunction} from "express";
import { AppError } from "../errors/appError.error";
import * as userServices from "../services/user.service";
import { ReqBody } from "../types/request";
import { CreateUserProfileSchema, SUCCESS_RESPONSE_CODE } from "@connect/shared";
import { successResponseData } from "../utils/response.util";
import { UnauthorizedError } from "../errors/unauthorized.error";

export const onboarding = async (req : ReqBody<CreateUserProfileSchema>, res : Response, next : NextFunction) => {
    try {
        const userId = req.userId;
    
        if(!userId) {
            throw new UnauthorizedError();
        }

        await userServices.onboarding({userId, userData : req.body});

        res.status(200).json(successResponseData(SUCCESS_RESPONSE_CODE.success, "Success"));
    } catch (err) {
        next(err);
    }
}

export const checkUsernameAvailability = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const username = req.query.username;

        if(!username || typeof username != "string") {
            throw new AppError(400, "BAD_REQUEST", "Username is missing");
        }

        const isAvailable = await userServices.checkUsernameAvailability(username);

        res.status(200).json(successResponseData(SUCCESS_RESPONSE_CODE.ok, "success", {available : isAvailable}));
    } catch (err){
        next(err);
    }
}

export const getUserProfile = async (req : Request, res: Response, next : NextFunction) => {
    try {
        const username = String(req.params.username);

        const user = await userServices.getUserProfile(username);
    } catch(err) {
        next(err);
    }
}