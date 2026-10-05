import {Redis} from "ioredis";


let redis : Redis | null = null;

export function getRedis () {
    if(!redis) {
        const redisUrl = process.env.REDIS_URL;

        if(!redisUrl) {
            throw new Error("Something is Missing");
        }
    
        redis = new Redis(redisUrl,{maxRetriesPerRequest : null});
        
        redis.on("error", (err : unknown) => {
            console.log(err);
        })
    }

    return redis;
}