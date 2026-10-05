import { createLimiter } from "../core/limiter.factory.js";

export const signupLimiter = createLimiter({duration : (60 * 3), keyPrefix : "signup:", points : 15});