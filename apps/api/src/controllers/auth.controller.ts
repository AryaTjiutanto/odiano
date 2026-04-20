import "../bootstraps/env.bootstrap";
import { Request, Response, NextFunction } from "express";
import * as authServices from "../services/auth.service";
import { AppError } from "../errors/appError.error";
import { successResponseData } from "../utils/response.util";
import { AUTH_TOKEN, SignInResponse, SignUpResponse, UserDTO } from "@connect/shared";
import { authCookieOptions } from "../libs/auth/cookie";

export const signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
    
        if (!email || !password) {
            throw new AppError(400, "BAD_REQUEST", "Something is missing");
        }

        const authData = await authServices.signIn(email, password);

        res.cookie(AUTH_TOKEN.REFRESH, authData.refresh_token, authCookieOptions());

        res.status(200).json(successResponseData<SignInResponse>("SUCCESS", "Login successfully", {
            [AUTH_TOKEN.ACCESS]: authData.access_token,
        }))
    } catch (err) {
        next(err);
    }
}

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, username, email, password } = req.body;
    
        if (!name || !username || !email || !password) {
            throw new AppError(400, "BAD_REQUEST", "Something is missing");
        }

        const authData = await authServices.signUp(name, username, email, password);

        res.cookie(AUTH_TOKEN.REFRESH, authData.refresh_token, authCookieOptions());

        res.status(201).json(successResponseData<SignUpResponse>("CREATED", "Register successfully", {
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
            throw new AppError(401, "UNAUTHORIZED", "unauthorized");
        }

        const data = await authServices.me(userId);
    
        res.status(200).json(successResponseData<UserDTO>("SUCCESS", "Success", data));
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
            throw new AppError(401,"UNAUTHORIZED", "Unauthorized")
        }

        const authData = await authServices.refresh(userId, tokenId, refreshToken);

        res.cookie(AUTH_TOKEN.REFRESH, authData.refresh_token, authCookieOptions());

        res.status(200).json(successResponseData<SignInResponse>("SUCCESS", "Successfully refresh the session", {
            access_token: authData.access_token
        }))
    } catch (err) {
        next(err);
    }
}