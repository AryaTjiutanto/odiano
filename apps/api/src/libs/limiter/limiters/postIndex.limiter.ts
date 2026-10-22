import { createLimiter } from "../core/limiter.factory.js";

export const postIndexLimiter = createLimiter({duration : 30, keyPrefix : "posts:index:", points : 10}); 