import { getRedis } from "@odiano/redis"
import { RateLimiterMemory, RateLimiterRedis } from "rate-limiter-flexible"

type CreateLimiterProps = {
    duration: number,
    points: number,
    keyPrefix: string,
}

export const createLimiter = (props: CreateLimiterProps) => {
    return new RateLimiterRedis({
        duration: props.duration,
        points: props.points,
        storeClient: getRedis(),
        keyPrefix: props.keyPrefix,
        insuranceLimiter: new RateLimiterMemory({
            duration: props.duration,
            points: props.points,
            keyPrefix: props.keyPrefix,
        })
    })
}