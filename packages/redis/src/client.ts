    import { Redis } from "ioredis";

    let redis: Redis | null = null;

    export function getRedis() {
        if (!redis) {
            const NODE_ENV = process.env.NODE_ENV;
            const redisUrl = process.env.REDIS_URL;

            if (!redisUrl) {
                throw new Error("Something is Missing");
            }

            if (NODE_ENV == "production") {
                redis = new Redis(redisUrl, { 
                    tls : {
                        servername : new URL(redisUrl).hostname
                    }, 
                    maxRetriesPerRequest : null })
            } else {
                redis = new Redis(redisUrl, { maxRetriesPerRequest: null });
            }

            redis.on("error", (err: unknown) => {
                console.log(err);
            })
        }

        return redis;
    }