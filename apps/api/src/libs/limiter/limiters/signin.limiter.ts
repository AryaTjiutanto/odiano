import { createLimiter } from "../core/limiter.factory";

export const signinLimiter = createLimiter({duration : 60, keyPrefix : "signin", points : 10});