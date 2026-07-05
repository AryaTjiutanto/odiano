import { createLimiter } from "../core/limiter.factory";

export const searchLimiter = createLimiter({duration : 8, keyPrefix : "search", points : 7});