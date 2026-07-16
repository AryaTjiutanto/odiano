import { createLimiter } from "../core/limiter.factory";

export const postIndexLimiter = createLimiter({duration : 60, keyPrefix : "posts:index:", points : 50}); 