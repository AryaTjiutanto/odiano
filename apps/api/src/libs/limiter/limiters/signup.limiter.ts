import { createLimiter } from "../core/limiter.factory";

export const signupLimiter = createLimiter({duration : (60 * 3), keyPrefix : "signup:", points : 15});