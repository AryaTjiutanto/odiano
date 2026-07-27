import "../bootstraps/env.bootstrap";
import { Request, Response, NextFunction } from "express";
import * as authServices from "../services/auth.service";
import { AppError } from "../errors/appError.error";
import { successResponseData } from "../utils/response.util";
import { AUTH_TOKEN, CreateUserSchema, ERROR_RESPONSE_CODE, AuthenticationResponse,  SUCCESS_RESPONSE_CODE, type CurrentUserDTO, OTP_PURPOSES, OTP_CHANNELS } from "@odiano/shared";
import { authCookieOptions } from "../libs/auth/auth.cookie";
import { ReqBody } from "../types/request.type";
import { type AuthenticateUserSchema } from "@odiano/shared";
import { UnauthorizedError } from "../errors/unauthorized.error";
import * as googleService from "../services/google.service";

export const signin = async (req: ReqBody<AuthenticateUserSchema>, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
    
        if (!email || !password) {
            throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Something is missing");
        }

        const ip = req?.ip || "anonymous";
        const authData = await authServices.signIn(email, password, ip);

        res.cookie(AUTH_TOKEN.REFRESH, authData.refresh_token, authCookieOptions());

        res.status(200).json(successResponseData<AuthenticationResponse>(SUCCESS_RESPONSE_CODE.success, "Login successfully", {
            [AUTH_TOKEN.ACCESS]: authData.access_token,
        }))
    } catch (err) {
        console.log(err);
        next(err);
    }
}

export const signup = async (req: ReqBody<CreateUserSchema>, res: Response, next: NextFunction) => {
    try {
        // get and check the data
        const { dateOfBirth, email, password } = req.body;
    
        if (!dateOfBirth || !email || !password) {
            throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Something is missing");
        }

        // signup process
        const ip = req?.ip || "anonymous";
        const authData = await authServices.signUp(dateOfBirth, email, password, ip);
        
        // response
        res.cookie(AUTH_TOKEN.REFRESH, authData.refresh_token, authCookieOptions());
        res.status(201).json(successResponseData<AuthenticationResponse>(SUCCESS_RESPONSE_CODE.created, "Register successfully", {
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

        res.status(200).json(successResponseData<AuthenticationResponse>(SUCCESS_RESPONSE_CODE.success, "Successfully refresh the session", {
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

export const googleAuth = async (req : Request, res : Response, next : NextFunction) => {
    const {credential} = req.body
    
    try {
        if(!credential) {
            throw new AppError(400, ERROR_RESPONSE_CODE.badRequest, "Something is missing");
        }    

        const result = await googleService.authentication(credential);

        res.cookie(AUTH_TOKEN.REFRESH, result.refresh_token, authCookieOptions());
        res.status(200).json(successResponseData<AuthenticationResponse>(SUCCESS_RESPONSE_CODE.ok, "ok", {access_token : result.access_token}))
    } catch (err) {
        next(err);
    }
}

export const resendEmailVerification = async (req : Request, res : Response, next : NextFunction) => {
    const currentUserId = req.userId;
    
    try {
        if(!currentUserId) { 
            throw new UnauthorizedError();
        }

        await authServices.sendEmailVerification(currentUserId);

        res.status(200).json(successResponseData(SUCCESS_RESPONSE_CODE.success, "success"));
    } catch (err) {
        next(err);
    }
};

export const verifyEmail = async (req : Request, res : Response, next : NextFunction) => {
    const currentUserId = req.userId;
    const { code } = req.body;
    
    try {
        if(!currentUserId) { 
            throw new UnauthorizedError();
        }

        await authServices.verifyEmail(currentUserId, code);

        res.status(200).json(successResponseData(SUCCESS_RESPONSE_CODE.success, "success"));
    } catch (err) {
        next(err);
    }
}