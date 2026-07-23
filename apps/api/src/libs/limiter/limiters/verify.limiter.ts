import { createLimiter } from "../core/limiter.factory";

export const verifyLimiter = createLimiter({duration : 30, keyPrefix : "verify:", points : 5});