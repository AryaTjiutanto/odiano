import { error } from "console";
import "../../bootstraps/env.bootstrap";
import jwt from "jsonwebtoken";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

export const generateAccessToken = (payload : {id : string}) => {
    if(!accessTokenSecret) {
        throw Error("Access Token secret is missing");
    }

    return jwt.sign(payload, accessTokenSecret, {
        expiresIn : "15m",
    })
}

export const generateRefreshToken = (payload : {id : string, tokenId : string}) => {
    if(!refreshTokenSecret) {
        throw Error("Refresh Token secret is missing");
    }

    return jwt.sign({id : payload.id}, refreshTokenSecret, {
        expiresIn : "30d"
    })
}

export const verifyAccessToken = (id : string) => {
    if(!accessTokenSecret) {
        throw Error("Access Token secret is missing");
    }

    return jwt.verify(id, accessTokenSecret);
}

export const verifyRefreshToken = (id : string) => {
    if(!refreshTokenSecret) {
        throw Error("Refresh Token secret is missing")
    }

    return jwt.verify(id, refreshTokenSecret);
}