import { createLimiter } from "../core/limiter.factory.js";

export const verifyLimiter = createLimiter({duration : 30, keyPrefix : "verify:", points : 5});