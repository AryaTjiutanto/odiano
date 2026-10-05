import { createLimiter } from "../core/limiter.factory.js";

const commentLimiter = createLimiter({
    duration : 1 * 30,
    points : 6,
    keyPrefix : "comment:create:",
});

export default commentLimiter;