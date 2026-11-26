import { AUTH_TOKEN } from "./auth.const.js"

export type AuthenticationResponse = {
    [AUTH_TOKEN.ACCESS] : string,
};