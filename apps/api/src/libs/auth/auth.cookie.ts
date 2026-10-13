import { CookieOptions } from "express";

const oneDayAge = 1 * 24 * 60 * 60 * 1000;

export const authCookieOptions = () : CookieOptions => {
    return {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: oneDayAge * 30,
        secure: process.env.NODE_ENV === "production",
    }
}