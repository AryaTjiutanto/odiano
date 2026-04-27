import { Request, Response, NextFunction} from "express";
import { AppError } from "../errors/appError.error";
import * as userServices from "../services/user.service";
import { ReqBody } from "../types/request";
import { CreateUserProfileSchema } from "@connect/shared";
import { successResponseData } from "../utils/response.util";
import { UnauthorizedError } from "../errors/unauthorized.error";

export const onboarding = async (req : ReqBody<CreateUserProfileSchema>, res : Response, next : NextFunction) => {
    try {
        const userId = req.userId;
    
        if(!userId) {
            throw new UnauthorizedError();
        }

        await userServices.onboarding({userId, userData : req.body});

        res.status(200).json(successResponseData("SUCCESS", "Success"));
    } catch (err) {
        next(err);
    }
}