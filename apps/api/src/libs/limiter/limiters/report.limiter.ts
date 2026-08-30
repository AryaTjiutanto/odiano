import { createLimiter } from "../core/limiter.factory";

export const reportLimiter = createLimiter({duration : 20, points : 4, keyPrefix : "report:"});