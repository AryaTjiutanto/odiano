import { createLimiter } from "../core/limiter.factory.js";

export const postIndexLimiter = createLimiter({duration : 60, keyPrefix : "posts:index:", points : 50}); 