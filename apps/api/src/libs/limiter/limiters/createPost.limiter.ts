import { createLimiter } from "../core/limiter.factory";

export const createPostLimiter = createLimiter({duration:10 * 60, keyPrefix : "post:create:", points : 10})