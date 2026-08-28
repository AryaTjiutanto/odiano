import { AUTH_TOKEN } from "./auth.const"

export type AuthenticationResponse = {
    [AUTH_TOKEN.ACCESS] : string,
};