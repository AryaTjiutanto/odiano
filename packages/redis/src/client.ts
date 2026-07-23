import Redis from "ioredis";

export const redis = new Redis({maxRetriesPerRequest : null});

redis.on("error", (err) => {
    console.log(err);
})