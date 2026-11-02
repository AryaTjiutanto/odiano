import { JwtPayload } from "jsonwebtoken"

export type RefreshTokenPayload = {
    userId : string,
    sessionId : string,
    tokenId : string,
}

export type AccessTokenPayload = {
    sessionId : string,
    userId : string
}

export type TokenPayload<T> = JwtPayload & T