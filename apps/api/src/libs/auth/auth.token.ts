import "../../bootstraps/env.bootstrap";
import jwt from "jsonwebtoken";
import { AccessTokenPayload, RefreshTokenPayload, TokenPayload } from "./auth.types";
import { UnauthorizedError } from "../../errors/unauthorized.error";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

export const generateAccessToken = (payload : AccessTokenPayload) => {
    if(!accessTokenSecret) {
        throw new Error("Access Token secret is missing");
    }

    return jwt.sign(payload, accessTokenSecret, {
        expiresIn : "15m",
    })
}

export const generateRefreshToken = (payload : RefreshTokenPayload) => {
    if(!refreshTokenSecret) {
        throw new Error("Refresh Token secret is missing");
    }

    return jwt.sign(payload, refreshTokenSecret, {
        expiresIn : "30d"
    })
}

export const verifyAccessToken = (token : string) : TokenPayload<AccessTokenPayload> => {
    if(!accessTokenSecret) {
        throw new Error("Access Token secret is missing");
    }

    try {
        const decoded = jwt.verify(token, accessTokenSecret);
    
        if(typeof decoded === "string") {
            throw new UnauthorizedError();
        }
    
        return decoded as TokenPayload<AccessTokenPayload>;
    } catch(err) {
        if(err instanceof UnauthorizedError) {
            throw err
        }

        throw new UnauthorizedError("Expired or invalid token");
    }
}

export const verifyRefreshToken = (token : string) : TokenPayload<RefreshTokenPayload> => {
    if(!refreshTokenSecret) {
        throw new Error("Refresh Token secret is missing")
    }

    try {
        const decoded = jwt.verify(token, refreshTokenSecret);
    
        if(typeof decoded === "string") {
            throw new UnauthorizedError();
        }
    
        return decoded as TokenPayload<RefreshTokenPayload>;
    } catch (err) {
        if(err instanceof UnauthorizedError) {
            throw err;
        }

        throw new UnauthorizedError("Expired or invalid token");
    }
}