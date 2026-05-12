import "../bootstraps/env.bootstrap";
import { Request, Response, NextFunction } from "express";
import * as authServices from "../services/auth.service";
import { AppError } from "../errors/appError.error";
import { successResponseData } from "../utils/response.util";
import { AUTH_TOKEN, CreateUserSchema, ERROR_RESPONSE_CODE, SignInResponse, SignUpResponse, SUCCESS_RESPONSE_CODE, type CurrentUserDTO } from "@connect/shared";
import { authCookieOptions } from "../libs/auth/auth.cookie";
import { ReqBody } from "../types/request";
import { type AuthenticateUserSchema } from "@connect/shared";
import { UnauthorizedError } from "../errors/unauthorized.error";

export const signin = async (req: ReqBody<AuthenticateUserSchema>, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
    
        if (!email || !password) {
            throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Something is missing");
        }

        const ip = req?.ip || "anonymous";
        const authData = await authServices.signIn(email, password, ip);

        res.cookie(AUTH_TOKEN.REFRESH, authData.refresh_token, authCookieOptions());

        res.status(200).json(successResponseData<SignInResponse>(SUCCESS_RESPONSE_CODE.success, "Login successfully", {
            [AUTH_TOKEN.ACCESS]: authData.access_token,
        }))
    } catch (err) {
        console.log(err);
        next(err);
    }
}

export const signup = async (req: ReqBody<CreateUserSchema>, res: Response, next: NextFunction) => {
    try {
        const { dateOfBirth, email, password } = req.body;
    
        if (!dateOfBirth || !email || !password) {
            throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Something is missing");
        }

        const authData = await authServices.signUp(dateOfBirth, email, password);

        res.cookie(AUTH_TOKEN.REFRESH, authData.refresh_token, authCookieOptions());

        res.status(201).json(successResponseData<SignUpResponse>(SUCCESS_RESPONSE_CODE.created, "Register successfully", {
            [AUTH_TOKEN.ACCESS] : authData.access_token,
        }))
    } catch (err) {
        next(err);
    }
}

export const me = async (req: Request, res: Response, next : NextFunction) => {
    try {
        const userId = req.userId;
    
        if(!userId) {
            throw new UnauthorizedError();
        }

        const data = await authServices.me(userId);
    
        res.status(200).json(successResponseData<CurrentUserDTO>(SUCCESS_RESPONSE_CODE.success, "Success", data));
    } catch(err) {
        next(err);
    }
}

export const refresh = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const userId = req.userId;
        const tokenId = req.tokenId;
        const refreshToken = req.cookies?.["refresh_token"];

        if(!userId || !tokenId || !refreshToken) {
            console.log("missing userId, tokenId, and refreshToken");
            throw new AppError(401,ERROR_RESPONSE_CODE.unauthorized, "Unauthorized")
        }

        const authData = await authServices.refresh(userId, tokenId, refreshToken);

        res.cookie(AUTH_TOKEN.REFRESH, authData.refresh_token, authCookieOptions());

        res.status(200).json(successResponseData<SignInResponse>(SUCCESS_RESPONSE_CODE.success, "Successfully refresh the session", {
            access_token: authData.access_token
        }))
    } catch (err) {
        next(err);
    }
}

export const logout = async (req : Request, res : Response, next : NextFunction) => {
    try {
        const refreshToken = req.cookies?.[AUTH_TOKEN.REFRESH];

        if(!refreshToken) {
            return res.status(200).json(successResponseData(SUCCESS_RESPONSE_CODE.ok, "Logged out successfully"));
        }

        await authServices.logout(refreshToken);

        res.clearCookie(AUTH_TOKEN.REFRESH, authCookieOptions());

        res.status(200).json(successResponseData(SUCCESS_RESPONSE_CODE.ok, "Logged out successfully"));
    } catch(err) {
        next(err);
    }
}