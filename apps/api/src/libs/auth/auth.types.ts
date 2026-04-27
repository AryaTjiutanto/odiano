import { JwtPayload } from "jsonwebtoken"

export type RefreshTokenPayload = {
    userId : string,
    tokenId : string,
}

export type AccessTokenPayload = {
    userId : string
}

export type TokenPayload<T> = JwtPayload & T