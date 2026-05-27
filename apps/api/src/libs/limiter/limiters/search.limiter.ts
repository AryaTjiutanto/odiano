import { createLimiter } from "../core/limiter.factory";

export const searchLimiter = createLimiter({duration : 8, keyPrefix : "username:check", points : 4})