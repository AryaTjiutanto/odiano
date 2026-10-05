import { createLimiter } from "../core/limiter.factory.js";

export const followingLimiter = createLimiter({duration : 30, keyPrefix : "following:",points: 50});