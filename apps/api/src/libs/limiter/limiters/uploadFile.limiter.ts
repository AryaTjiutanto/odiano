import { createLimiter } from "../core/limiter.factory";

export const uploadFileLimiter = createLimiter({
    duration: 60,
    keyPrefix: "upload:file:",
    points : 6,
})