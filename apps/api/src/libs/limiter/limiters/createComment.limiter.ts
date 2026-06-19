import { createLimiter } from "../core/limiter.factory";

const createCommentLimiter = createLimiter({
    duration : 1 * 30,
    points : 6,
    keyPrefix : "comment:create",
});

export default createCommentLimiter;