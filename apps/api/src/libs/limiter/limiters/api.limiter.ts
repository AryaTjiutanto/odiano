import { createLimiter } from "../core/limiter.factory";

export const apiLimiter = createLimiter({duration : 60, points : 100, keyPrefix : "api"});