import Redis from "ioredis";

export const redis = new Redis();

redis.on("error", (err) => {
    console.log(err);
})