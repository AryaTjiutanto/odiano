import { createLimiter } from "../core/limiter.factory";

export const likeLimiter = createLimiter({duration : 30, keyPrefix : "like", points: 20});