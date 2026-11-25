import { AUTH_TOKEN } from "../authentication/auth.const.js";

export const COOKIE_VALUES = {
    VERIFICATION_CHALLENGE : "verificationChallenge",
    REFRESH_TOKEN : AUTH_TOKEN.REFRESH
} as const

export type CookieValues = typeof COOKIE_VALUES[keyof typeof COOKIE_VALUES];