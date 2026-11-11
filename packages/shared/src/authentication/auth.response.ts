import { AUTH_TOKEN } from "./auth.const.js"

type RequireVerificationResponse = {
    requireVerification: true;
    requestVerificationToken: string;
};

export type VerificationResponse<T> = RequireVerificationResponse | {
    requireVerification: false;
} & T;

export type AuthenticationResponse = {
    [AUTH_TOKEN.ACCESS] : string,
};