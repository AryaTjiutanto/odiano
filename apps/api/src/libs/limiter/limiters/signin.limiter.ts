import { createLimiter } from "../core/limiter.factory.js";

export const signinLimiter = createLimiter({duration : 60, keyPrefix : "signin:", points : 10});