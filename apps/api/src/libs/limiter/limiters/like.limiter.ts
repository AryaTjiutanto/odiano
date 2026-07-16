import { createLimiter } from "../core/limiter.factory";

export const likeLimiter = createLimiter({duration : 15, keyPrefix : "like:", points: 10});