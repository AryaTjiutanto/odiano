import { RateLimiterMemory, RateLimiterRedis } from "rate-limiter-flexible"
import { redis } from "../../redis"

type CreateLimiterProps = {
    duration: number,
    points: number,
    keyPrefix: string,
}

export const createLimiter = (props: CreateLimiterProps) => {
    return new RateLimiterRedis({
        duration: props.duration,
        points: props.points,
        storeClient: redis,
        keyPrefix: props.keyPrefix,
        insuranceLimiter: new RateLimiterMemory({
            duration: props.duration,
            points: props.points,
            keyPrefix: props.keyPrefix,
        })
    })
}