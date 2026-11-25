import { CookieOptions } from "express"

export const generateCookieOptions = (maxAge : number = 1 * 24 * 60 * 60, isHttpOnly : boolean = false) : CookieOptions => {
    return {
        httpOnly: isHttpOnly,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: maxAge,
        secure: process.env.NODE_ENV === "production",
    }
}