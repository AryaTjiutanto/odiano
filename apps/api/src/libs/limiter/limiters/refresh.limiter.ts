import { createLimiter } from "../core/limiter.factory";

export const refreshLimiter = createLimiter({duration : 60, keyPrefix : "refresh", points : 30})