import { createLimiter } from "../core/limiter.factory.js";

export const refreshLimiter = createLimiter({duration : 60, keyPrefix : "refresh:", points : 30})