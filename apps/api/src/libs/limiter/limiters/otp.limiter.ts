import { createLimiter } from "../core/limiter.factory";

export const otpLimiter = createLimiter({
    duration : 60,
    points: 3,
    keyPrefix: "otp:",
})