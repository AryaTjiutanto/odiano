import { createLimiter } from "../core/limiter.factory.js";

export const shortUploadFileLimiter = createLimiter({
    duration: 30,
    keyPrefix: "upload:file:30s:",
    points : 3,
})

export const longUploadFileLimiter = createLimiter({
    duration : 1 * 24 * 60 * 60,
    keyPrefix : "upload:File:1d:",
    points : 40
})

