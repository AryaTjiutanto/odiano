import { createLimiter } from "../core/limiter.factory.js";

export const apiLimiter = createLimiter({duration : 60, points : 60, keyPrefix : "api:"});