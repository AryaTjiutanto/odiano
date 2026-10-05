import { createLimiter } from "../core/limiter.factory.js";

export const searchLimiter = createLimiter({duration : 8, keyPrefix : "search:", points : 6});