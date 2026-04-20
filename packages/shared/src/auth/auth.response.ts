import { AUTH_TOKEN } from "./auth.const"

export type SignInResponse = {
    [AUTH_TOKEN.ACCESS] : string,
};

export type SignUpResponse = {
    [AUTH_TOKEN.ACCESS] : string,
}
