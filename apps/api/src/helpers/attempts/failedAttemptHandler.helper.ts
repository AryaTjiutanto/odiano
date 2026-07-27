import { ERROR_RESPONSE_CODE, FailedAttemptError } from "@odiano/shared";
import { AppError } from "../../errors/appError.error";
import { setCache } from "@odiano/redis";

type Params = {
    cacheKey : string,
    attempt : number,
    MAX_ATTEMPT : number,
    message : string,
}

export const failedAttemptHandler = async (params : Params) : Promise<never> => {
    params.attempt++;

    await setCache(params.cacheKey, (params.attempt), { PX: 24 * 60 * 60 * 1000 });
    const attemptLeft = params.MAX_ATTEMPT - params.attempt;
    throw new AppError(400, ERROR_RESPONSE_CODE.failedAttempt, `${params.message}, ${attemptLeft > 0 ? attemptLeft : "no"} attempt left`, {
        attemptLeft: params.MAX_ATTEMPT - params.attempt
    } as FailedAttemptError);
}