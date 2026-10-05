import { createLimiter } from "../core/limiter.factory.js";

export const updateProfileLimiter = createLimiter({
    duration : 1 * 24 * 60 * 60,
    keyPrefix : "user:profile:update:",
    points : 5,
});