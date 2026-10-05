import { ERROR_RESPONSE_CODE, TooManyRequestError } from "@odiano/shared";
import { getCachePTTL } from "@odiano/redis";
import { AppError } from "../../errors/appError.error.js";

type Params = {
    cacheKey : string,
    message : string,
}

export const tooManyAttemptHandler = async (params : Params) => {
    const timeLeftMs = await getCachePTTL(params.cacheKey);

    throw new AppError(429, ERROR_RESPONSE_CODE.tooManyRequests, params.message, {
        timeLeftMs
    } as TooManyRequestError);
}